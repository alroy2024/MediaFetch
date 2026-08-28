package com.mediafetch.backend.novel.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import org.springframework.cache.annotation.Cacheable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.mediafetch.backend.novel.dto.NovelDto;
import com.mediafetch.backend.novel.dto.RequestDto;
import com.microsoft.playwright.*;

@Service
public class NovelFetchService {

    private static final Logger logger = LoggerFactory.getLogger(NovelFetchService.class);

    private Playwright playwright;
    private Browser browser;

    @PostConstruct
    public void init() {
        logger.info("Initializing Playwright and launching browser...");
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
    }

    @PreDestroy
    public void close() {
        logger.info("Closing Playwright browser...");
        if (browser != null)
            browser.close();
        if (playwright != null)
            playwright.close();
    }

    public List<NovelDto> getName(RequestDto requestDto) {
        String query = requestDto.searchQuery();
        List<NovelDto> results = new ArrayList<>();

        try (BrowserContext context = browser.newContext();
                Page page = context.newPage()) {

            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            page.navigate("https://www.webnovel.com/search?keywords=" + encodedQuery);

            page.waitForSelector("ul.j_result_wrap");
            Locator books = page.locator("ul.j_result_wrap li:has(a.g_thumb)");

            for (Locator item : books.all()) {
                Long id = Long.parseLong(item.locator("a.g_thumb").getAttribute("data-bookid"));
                String title = item.locator("h3").innerText();
                String image = item.locator("img").getAttribute("src");
                String url = normalizeUrl(item.locator("a.g_thumb").getAttribute("href"));
                String description = getOptionalText(item.locator("p.fs16.c_000.ells._2.lh24"));
                NovelDto dto = new NovelDto(id, title, image, url, description, 0, 0, "ONGOING", false);
                results.add(dto);
            }

        } catch (PlaywrightException e) {
            logger.error("Playwright failed to scrape titles for query: {}", query, e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred during scraping", e);
        }

        return results;
    }

    @Cacheable("Novel")
    public List<NovelDto> getTopNovelDtos() {
        List<NovelDto> results = new ArrayList<>();

        try (BrowserContext context = browser.newContext();
                Page page = context.newPage()) {

            page.navigate("https://www.webnovel.com/stories");
            page.waitForSelector("ul.clearfix");
            page.evaluate("window.scrollBy(0, window.innerHeight)");
            page.waitForTimeout(1500);

            Locator books = page.locator("ul.clearfix li:has(a.g_thumb)");

            for (Locator item : books.all()) {
                Long id = Long.parseLong(item.locator("a.j_add_to_library").getAttribute("data-bookid"));
                String title = item.locator("a.c_l").innerText();
                String image = item.locator("img").getAttribute("src");
                String url = normalizeUrl(item.locator("a.g_thumb").getAttribute("href"));
                String description = getOptionalText(item.locator("p.fs16.c_000.ells._2.lh24"));
                NovelDto dto = new NovelDto(id, title, image, url, description, 0, 0, "ONGOING", false);
                results.add(dto);
                if (results.size() > 19) {
                    break;
                }
            }

        } catch (PlaywrightException e) {
            logger.error("Playwright failed to scrape top novels", e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred during scraping", e);
        }

        return results;
    }

public int fetchCurrentChapter(String url) {
        try (BrowserContext context = browser.newContext();
                Page page = context.newPage()) {
            if (url == null || url.isBlank()) {
                logger.warn("Cannot fetch chapter count because the novel URL is missing");
                return 0;
            }
            
            page.navigate(url);

            // Wait up to 10 seconds, but catch the exception so it doesn't crash the loop
            try {
                page.waitForSelector("strong:has(use[href='#i-chapter']) span", 
                    new Page.WaitForSelectorOptions().setTimeout(500));
            } catch (Exception e) {
                logger.warn("Timeout waiting for chapter element on URL: {}. Trying alternative selector...", url);
            }

            // Try primary selector first
            Locator chaptersContainer = page.locator("strong:has(use[href='#i-chapter']) span");
            if (chaptersContainer.count() > 0) {
                String text = chaptersContainer.first().innerText();
                int chapters = extractNumber(text);
                if (chapters > 0) return chapters;
            }

            // Fallback selector: Look for any text containing "Chs" or "Chapters" if the SVG layout changed
            Locator fallbackLocator = page.locator("text=/\\d+\\s*(Chs|Chapters)/i");
            if (fallbackLocator.count() > 0) {
                String text = fallbackLocator.first().innerText();
                int chapters = extractNumber(text);
                if (chapters > 0) return chapters;
            }

            logger.warn("Could not find chapter count for URL: {}", url);
            return 0;

        } catch (PlaywrightException e) {
            logger.error("Playwright failed to fetch chapter count for novel {}", url, e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred fetching chapter count for novel {}", url, e);
        }
        return 0;
    }   

    private String normalizeUrl(String href) {
        if (href == null || href.isBlank()) {
            return "";
        }
        if (href.startsWith("http")) {
            return href;
        }
        return "https://www.webnovel.com" + href;
    }

    private String getOptionalText(Locator locator) {
        return locator.count() == 0 ? "" : locator.first().innerText();
    }

    private int extractNumber(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        String digits = value.replaceAll("\\D+", "");
        return digits.isEmpty() ? 0 : Integer.parseInt(digits);
    }
}
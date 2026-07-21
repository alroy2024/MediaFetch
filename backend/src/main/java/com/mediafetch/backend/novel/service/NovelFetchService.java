package com.mediafetch.backend.novel.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

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
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
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


            // Map strings to DTOs
            for (Locator item : books.all()) {
                Long id = Long.parseLong(item.locator("a.g_thumb").getAttribute("data-bookid"));     
                String title = item.locator("h3").innerText();
                String image = item.locator("img").getAttribute("src");
                NovelDto dto = new NovelDto(id,title,image);
                results.add(dto);
            }

        } catch (PlaywrightException e) {
            logger.error("Playwright failed to scrape titles for query: {}", query, e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred during scraping", e);
        }
        
        return results;
    }
}
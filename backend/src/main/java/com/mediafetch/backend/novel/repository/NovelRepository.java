package com.mediafetch.backend.novel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediafetch.backend.novel.model.Novel;

public interface NovelRepository extends JpaRepository<Novel,Integer>{

}

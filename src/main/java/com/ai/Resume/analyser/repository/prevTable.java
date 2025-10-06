package com.ai.Resume.analyser.repository;

import com.ai.Resume.analyser.model.previousTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface prevTable extends JpaRepository<previousTable,String> {

}

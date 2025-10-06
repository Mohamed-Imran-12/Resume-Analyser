package com.ai.Resume.analyser.repository;

import com.ai.Resume.analyser.model.otpVerify;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface otpVerifyRepo extends JpaRepository<otpVerify,String> {
}

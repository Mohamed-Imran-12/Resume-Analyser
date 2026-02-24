package com.ai.Resume.analyser.model;

import lombok.Data;

import java.util.List;

@Data
public class JobSearchResponse {

    private List<Job> results;
    private int count;
    private double mean;
}

package com.ai.Resume.analyser.model;

import lombok.Data;

@Data
public class Job {

    private String id;
    private String title;
    private String description;
    private String redirect_url;

    private Company company;
    private Location location;
    private Category category;
}

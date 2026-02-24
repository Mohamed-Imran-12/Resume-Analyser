package com.ai.Resume.analyser.model;

import lombok.Data;

import java.util.List;

@Data
public class Location {
    private String display_name;
    private List<String> area;
}

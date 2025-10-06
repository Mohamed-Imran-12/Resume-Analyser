package com.ai.Resume.analyser.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class resultsDto {


    private  int score;
    private int atsoptimizationscore;
    private List<String> pros;
    private List<String> cons;
    private List<String> suggestions;

}

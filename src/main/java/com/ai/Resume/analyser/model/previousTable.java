package com.ai.Resume.analyser.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class previousTable {

    @Id
    private String email;

    private int score;
    private int atsoptimizationscore;

    @ElementCollection
    @Column(length = 450)
    private List<String> pros;

    @ElementCollection
    @Column(length = 450)
    private List<String> cons;

    @ElementCollection
    @Column(length = 450)
    private List<String> suggestions;

}

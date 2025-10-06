package com.ai.Resume.analyser.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;


@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class usersTable {

    private  String username;
    @Id
    private  String email;
    private  String password;
    private  Boolean previousResults;
    private  String resetOtp;
    private  Date resetExpiration;


    @CreationTimestamp
    @Column(updatable = false)
    private Date createdAt;

    @UpdateTimestamp
    private Date updateAt;


}

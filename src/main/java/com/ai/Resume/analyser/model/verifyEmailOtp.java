package com.ai.Resume.analyser.model;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class verifyEmailOtp {

    @NotBlank(message = "Username must not be empty")
    private String username;

    @Email
    @NotBlank( message= "Email must not be empty")
    private String email;


}

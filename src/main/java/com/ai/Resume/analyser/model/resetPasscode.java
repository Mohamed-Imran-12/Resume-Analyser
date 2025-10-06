package com.ai.Resume.analyser.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class resetPasscode {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min=6 ,max=6)
    private String otp;

    @Size(min=6 , max = 16)
    private String password;
}

package com.ai.Resume.analyser.configuration;

import com.ai.Resume.analyser.model.usersTable;
import com.ai.Resume.analyser.repository.usersTableRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class entryPointService implements UserDetailsService {


    @Autowired
    private usersTableRepo usersTableRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        usersTable user = usersTableRepository.findById(username).orElse(null);



        return User.builder().username(user.getEmail()).password(user.getPassword() != null ? user.getPassword() : "").roles("user").build();
    }
}

//
//
//package com.ofds.config;
// 
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import com.ofds.config.JwtAuthenticationFilter;
//import com.ofds.repository.CustomerRepository;
//import com.ofds.service.CustomerService;
//import com.ofds.service.CustomerUserDetailsService;
// 
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//	
//	@Autowired
//	private CustomerUserDetailsService customerUserDetailsService;
//	
//	@Autowired
//    JwtAuthenticationFilter jwtFilter;
// 
////    @Bean
////    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
////        // Disabling CSRF protection (common for REST APIs)
////        http.csrf(csrf -> csrf.disable());
//// 
////        // Allowing all requests to any endpoint without authentication
////        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
//// 
////        // Explicitly disable basic authentication and the login page
////        http.httpBasic(basic -> basic.disable());
////        http.formLogin(form -> form.disable());
//// 
////        return http.build();
////    }
//	
//
//
//	@Bean
//	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//	    http
//	        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Enable CORS
//	        .csrf(csrf -> csrf.disable())
//	        .authorizeHttpRequests(auth -> auth
//	            .requestMatchers("/auth/**").permitAll() // ✅ Public endpoints
//	            .anyRequest().authenticated()            // ✅ Secure everything else
//	        )
//	        .sessionManagement(session -> session
//	            .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // ✅ Stateless for JWT
//	        )
//	        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // ✅ Add JWT filter
//
//	    return http.build();
//	}
//
//    
////    @Bean
////    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
////		// Enables CORS using the defined configuration source.
////        http
////            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Enable CORS
////            
////         // Disables CSRF protection for stateless APIs.
////         //CSRF protection (Cross-Site Request Forgery protection) is a 
////         //security measure that prevents malicious websites from making 
////         //unauthorized requests on behalf of a logged-in user to another site 
////         // where that user is authenticated.
////            .csrf(csrf -> csrf.disable())
////            
////            // Configures authorization rules for HTTP requests.
////            .authorizeHttpRequests(auth -> auth
////            		
////             // Allows unauthenticated access to endpoints under /auth/**.	
////             .requestMatchers("/auth/**").permitAll()
////                
////             // Requires authentication for all other endpoints.
////             .anyRequest().authenticated()
////            )
////            
////            // Configures session management.
////            .sessionManagement(session -> session
////            		
////            	// Sets session policy to stateless for JWT-based authentication.
////                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
////            )
////            
////             // Adds the JWT filter before the default username-password filter.
////            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
////
////        // Builds and returns the configured security filter chain.
////        return http.build();
////    }
//
//    // ✅ Define CORS configuration globally
//    @Bean
//    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.addAllowedOrigin("http://localhost:4200"); // Angular dev server
//        config.addAllowedMethod("*"); // GET, POST, PUT, DELETE, etc.
//        config.addAllowedHeader("*"); // Authorization, Content-Type, etc.
//        config.setAllowCredentials(true); // If you're using cookies or credentials
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//    
//    // Configures and returns the authentication manager.
//    @Bean
//    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
//        return http.getSharedObject(AuthenticationManagerBuilder.class)
//            .userDetailsService(customerUserDetailsService)
//            .passwordEncoder(passwordEncoder())
//            .and()
//            .build();
//    }
//    
//
//    
//    //Return PasswordEncorder object to encrypt the passwords..
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//	    return new BCryptPasswordEncoder();
//	}
//}
package com.ofds.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ofds.config.JwtAuthenticationFilter;
import com.ofds.service.CustomerUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login", "/auth/register").permitAll() // ✅ Public endpoints
                .requestMatchers("/auth/update").authenticated()              // ✅ Require JWT for update
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
            .userDetailsService(customerUserDetailsService)
            .passwordEncoder(passwordEncoder())
            .and()
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

package ai.advance.jumei.session.config;


import ai.advance.jumei.session.ApiInterceptor;
import ai.advance.jumei.session.AuthInterceptor;
import ai.advance.jumei.session.LoginInterceptor;
import ai.advance.jumei.session.UserSetterInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {


    @Bean
    public UserSetterInterceptor userSetterInterceptor() {
        return new UserSetterInterceptor();
    }

    @Bean
    public LoginInterceptor loginInterceptor() {
        return new LoginInterceptor();
    }

    @Bean
    public AuthInterceptor authInterceptor() {
        return new AuthInterceptor();
    }


    @Bean
    public ApiInterceptor apiInterceptor() {
        return new ApiInterceptor();
    }


    public void addInterceptors(InterceptorRegistry registry) {


        String[] noLogin = new String[]{"/login", "/logout", "/api/**", "/data-source/*", "/login/*"};

        registry.addInterceptor(this.apiInterceptor()).addPathPatterns("/data-source/*", "/api/**");
        registry.addInterceptor(this.loginInterceptor()).excludePathPatterns(noLogin);
        registry.addInterceptor(this.authInterceptor()).excludePathPatterns(noLogin);
        registry.addInterceptor(this.userSetterInterceptor()).excludePathPatterns(noLogin);


    }


}

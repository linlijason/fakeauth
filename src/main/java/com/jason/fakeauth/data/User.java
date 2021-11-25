package com.jason.fakeauth.data;



import javax.persistence.*;
import java.util.Date;


@Entity
@Table(
        name = "user"
)
public class User {
    @Id
    @GeneratedValue(
            strategy = GenerationType.AUTO
    )
    @Column(
            name = "id"
    )
    private Long id;
    @Column(
            name = "username",
            length = 100
    )
    private String username;
    @Column(
            name = "password",
            length = 255
    )
    private String password;
    @Column(
            name = "status"
    )
    private Integer status;
    @Column(
            name = "date_created"
    )
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;
    @Column(
            name = "date_modified"
    )
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateModified;
    @Column(
            name = "is_super"
    )
    private Integer isSuper;
    @Column(
            name = "role"
    )
    private String role;


    public Long getId() {
        return this.id;
    }

    public void setId(Long var1) {
        this.id = var1;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String var1) {
        this.username = var1;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String var1) {
        this.password = var1;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer var1) {
        this.status = var1;
    }

    public Date getDateCreated() {
        return this.dateCreated;
    }

    public void setDateCreated(Date var1) {
        this.dateCreated = var1;
    }

    public Date getDateModified() {
        return this.dateModified;
    }

    public void setDateModified(Date var1) {
        this.dateModified = var1;
    }

    public Integer getIsSuper() {
        return this.isSuper;
    }

    public void setIsSuper(Integer var1) {
        this.isSuper = var1;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String var1) {
        this.role = var1;
    }
}


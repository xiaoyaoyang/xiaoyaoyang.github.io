# README

This is my second website. For me content is more important than the theme of it. 

Hope I can keep going this time.

Cheers


### To Do list 20160405

- [x] Add google analytics
- [ ] Fix feed.xml issue
- [x] linkedin site name does not work
- [ ] Update stock market for fun.r
- [ ] update New Year Resolution
- [ ] Fix post formula 

#calculate sample size 
##binomial model
alpha <- 0.05
beta <- 0.2
delta <- 0.05
p1 <- 0.2;p2 <- 0.15
p.sd <- sqrt(p1*(1-p1)+p2*(1-p2))
c1 <- qnorm(p = 1-alpha,mean = 0,sd = 1)
c2 <- qnorm(p = beta,mean = 0,sd = 1)
(n <- (p.sd*(c1-c2)/delta)^2)


(ideal_sample_norm <- 2*(c1-c2)^2/(delta/p.sd)^2)

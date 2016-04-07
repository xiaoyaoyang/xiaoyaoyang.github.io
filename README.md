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
##two sample z test (binomial) model
alpha <- 0.1
beta <- 0.1
p1 <- 0.5;p2 <- 0.55;delta <- abs(p1-p2)
p.sd <- sqrt(p1*(1-p1)+p2*(1-p2))
c1 <- qnorm(p = 1-alpha,mean = 0,sd = 1)
c2 <- qnorm(p = beta,mean = 0,sd = 1)
(n <- (p.sd*(c1-c2)/delta)^2)
#use build in function
power.prop.test(power=.9,p1=.55,p2=.5,sig.level=0.1,alternative = "one.sided")

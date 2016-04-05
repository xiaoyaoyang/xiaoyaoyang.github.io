---
layout:     post
title: "Hypothesis Test Sample Size and Power"
subtitle:   ""
date:       2016-04-02
author:     "Free Young"
header-img: "img/post-bg-05.jpg"
---

These is all start from the moment when I saw the post: <http://datapirates.blogspot.de/2016/03/why-ab-testing-sucks.html>. It claims A/B test, which is exactly two sample t test, is useless. Below is simulation running with R.

## Lets do some experiments!

First we generate two random vector *a* and *b*. In this case, average of *a* is 0.1467 while average of *b* is 0.19. Both vector *a* and *b* are made by binary element, and the ideal average of *a* is 0.15, while average of *b* is 0.2.




{% highlight r %}
#init
sample_s <-300
b_threshold <- 20
a_threshold <- 15
set.seed(106)
a <- (sample(x = 100,size = sample_s,replace=T)<a_threshold)*1
b <- (sample(x = 100,size = sample_s,replace=T)<b_threshold)*1
{% endhighlight %}



Next, lets do a simple two sample t test.



{% highlight r %}
test <- t.test(b, a, alternative = "greater")
t <- test$statistic
degree <- test$parameter
sigma <- sd(b - a)
ncp <- (b_threshold - a_threshold)/100 * sqrt(sample_s/2)/sigma
cat("p.value:", test$p.value, "power:", 1 - pt(q = t, df = degree, ncp = ncp))
{% endhighlight %}



{% highlight text %}
## p.value: 0.07829374 power: 0.3954021
{% endhighlight %}

Here we got p value = 0.07, if we set type I error threshold to 0.05, we can not reject the Null hypothesis. However, does that means we should accept Null hypothesis and believe mean of vector *a* and *b* are same? **No!**. Maybe it is easy to understand this way: if we accept null hypothesis and believe there is no difference between *a* and *b*, we have *61%* to make a mistake (type II), while if we reject Null hypothesis now, we have ~7% to make mistake (type I). The reason why we control type I error is that we can't take risk making that mistake. In another word, if we only have 300 samples each group and want to see if conversion rate improve or not, the answer should be **NO**.



Next, lets calculate the possible maximum power given alpha, sample size, alternative (or effect size?) under normal assumption. Below is the power and Null/alternative distribution. We can see that power reach 80% when we have more than 690 samples (in each group), and it is obvious 300 samples is not enough. Also, we can see that actually when we have 300 samples in each group, the distribution charts is close. Frankly speaking, two sample mean hypothesis is nothing but compare mean of two samples, taking variance, central limit theroem into consideration and use distribution to measure the probability.




{% highlight r %}
power_plot <- function(sample_size = 700, ifplot = FALSE) {
    alpha <- 0.05
    delta <- 0.05
    degree <- 2 * (sample_size - 1)
    pool_sd <- sqrt((var(a) + var(b))/2)
    c <- qt(1 - alpha, degree)
    ncp <- delta * sqrt(sample_size/2)/pool_sd
    power <- 1 - pt(q = c, df = degree, ncp = ncp)
    x <- seq(-3, 3, 0.01)
    title <- paste("Distribution of Null/alternative hypothesis for sample size=", 
        sample_size)
    if (ifplot == TRUE) {
        plot(x, dt(x, degree), type = "l", ylab = "Probability", main = title)
        lines(x, dt(x, degree, ncp), type = "l", col = "red")
    }
    return(power)
}
power.vector <- vector()
for (i in 100:1000) {
    power.vector[i - 99] <- power_plot(sample_size = i)
}
{% endhighlight %}


![plot of chunk unnamed-chunk-4](/figure/source/2016-04-02-hypothesis-test-sample-size/unnamed-chunk-4-1.png)

{% highlight text %}
## power: 0.7984382
{% endhighlight %}

![plot of chunk unnamed-chunk-4](/figure/source/2016-04-02-hypothesis-test-sample-size/unnamed-chunk-4-2.png)

{% highlight text %}
## power: 0.4959953
{% endhighlight %}

![plot of chunk unnamed-chunk-4](/figure/source/2016-04-02-hypothesis-test-sample-size/unnamed-chunk-4-3.png)

Actually, what the author in that post is doing, is similar to calculating the power of the test. Since power of test is that: under assumption that alternative hypothesis is correct, the probability of rejecting Null hypothesis. He run 100 simulation and found out ~50% reject and ~50% accept, which is near the power 0.57 that we are seeing in the above graph.



R has built in function to calculate sample size given type I error(alpha), type II error(beta), expected mean difference (delta), and data standard deviation. I also include calculation by hand under normal assumption. 




{% highlight r %}
#calculate sample size
alpha <- 0.05
beta <- 0.2
delta <- 0.05
pool_sd <- sqrt((var(a)+var(b))/2)
c1 <- qnorm(p = 1-alpha,mean = 0,sd = 1)
c2 <- qnorm(p = 1-beta,mean = 0,sd = 1)
(ideal_sample_norm <- 2*(c1+c2)^2/(delta/pool_sd)^2)
{% endhighlight %}



{% highlight text %}
## [1] 692.4188
{% endhighlight %}



{% highlight r %}
power.t.test(delta=delta,sd=pool_sd,sig.level=alpha,power=1-beta,type="two.sample",alternative="one.sided")
{% endhighlight %}



{% highlight text %}
## 
##      Two-sample t test power calculation 
## 
##               n = 693.0962
##           delta = 0.05
##              sd = 0.3741583
##       sig.level = 0.05
##           power = 0.8
##     alternative = one.sided
## 
## NOTE: n is number in *each* group
{% endhighlight %}

##Conclusion

Statistical A/B test or hypothesis test, is a very good technique to solve real world problem. However, understanding more about underlying assumption and requirement is important in real world.


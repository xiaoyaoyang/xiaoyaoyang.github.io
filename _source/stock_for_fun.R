require(dplyr)
require(ggplot2)
require(lubridate)
require(zoo)
require(readr)


dat <- read.csv('~/Desktop/table.csv')
col.names <- names(dat)
# col.names <- tolower(names(dat))
dat <- read_csv('~/Desktop/table.csv')
dat.sp <- read_csv('~/Desktop/sp_table.csv')
names(dat) <- col.names
names(dat.sp)  <- col.names
dat <- dat[match(sort(dat$Date),dat$Date),]
dat.sp <- dat[match(sort(dat.sp$Date),dat.sp$Date),]
head(dat)


# Setting params
start.date.ijr <- '2016-02-18'
start.price.ijr <- 101.35
day.hold.ijr <- round(abs(as.numeric(interval(today(),start.date.ijr))/3600/24))

(target.gain <- 8.78)  #target pct of gain
(days.hold <-day.hold.ijr) #days want to hold until sell

price <- dat$Adj.Close
len <- length(price)
result <- data.frame(index=1:len,best.index=NA,start.price=NA,best.price=NA,period.var=NA,gain=NA)
for (i in 1:len-1)
  {
  start.date.index <- i
  delta.price <- diff(price[start.date.index:(start.date.index+days.hold)])
  best.index <- which.max(cumsum(delta.price))+1
  best.price <- price[i+best.index-1]
  pct.gain <- (best.price-price[i])/price[i]
  result$index[i] <- i
  result$best.index[i] <- best.index
  result$start.price[i] <- price[i]
  result$best.price[i] <- best.price
  result$gain[i] <- pct.gain*100
  result$period.var[i] <- sd(price[start.date.index:(start.date.index+days.hold)])
  
}


res <- data.frame(date=as.Date(dat$Date),result)
res <- na.omit(res)
res.interest <- subset(res,res$date>='2009-01-01',na.omit=T)
gain <- na.omit(res.interest$gain)
(chance.to.gain <- sum(gain>target.gain)/length(gain))
res.interest$gain.lt <- gain>target.gain


#visualization
##when to buy
require(ggplot2)
plot.title=paste('When to Buy? (Target gain:',target.gain,'Hold until:',days.hold,'days)')
ggplot(res.interest,mapping = aes(x=date,y=start.price,color=gain.lt)) + 
  geom_point() + 
  labs(title = plot.title) +
  theme_bw()
##  variance
fit <- lm (res$period.var~res$date) 
plot(res$date,res$period.var,type='l')
lines(res$date,fit$fitted.values,col='red')
## more easy to reach 10%?
res.test <- subset(res.interest,TRUE)
yrmo <- as.yearmon(res.test$date)
res.test$yrmo <- yrmo
res.test$year <- year(res.test$date)
###aggregation
aggregate(data=res.test,gain~yrmo,FUN = mean)
yrmo.gain.freq <- aggregate(data=res.test,gain.lt~yrmo,FUN = sum)
year.gain.freq <- aggregate(data=res.test,gain.lt~year,FUN = mean)
plot(yrmo.gain.freq$yrmo,yrmo.gain.freq$gain.lt)
plot(yrmo.gain.freq$yrmo,cumsum(yrmo.gain.freq$gain.lt),'b')



## use sharpie rario (risk and market return)



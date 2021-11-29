#!/bin/sh
# ./ry.sh start 启动 stop 停止 restart 重启 status 状态
AppName=re.jar


APP_HOME=`pwd`


if [ "$1" = "" ];
then
    echo -e "\033[0;31m 未输入操作名 \033[0m  \033[0;34m {start|stop|restart|status} \033[0m"
    exit 1
fi

if [ "$AppName" = "" ];
then
    echo -e "\033[0;31m 未输入应用名 \033[0m"
    exit 1
fi

function start()
{
    PID=`ps -ef |grep java|grep $AppName|grep -v grep|awk '{print $2}'`

	if [ x"$PID" != x"" ]; then
	    echo "$AppName is running..."
	else
		nohup java -server -Dspring.redis.host=localhost -Dspring.redis.port=8021 -Dspring.redis.password=youshallnotpass9  -Djumei.auth.api.addr=http://8.214.92.119:23334/auth -Dspring.datasource.url="jdbc:mysql://localhost:9020/rule_engine?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&zeroDateTimeBehavior=convertToNull&connectTimeout=2000" -Dspring.datasource.username=developer -Dspring.datasource.password="*&uhnFk12HJK" -jar $AppName > /dev/null 2>&1 &
		echo "Start $AppName success..."
	fi
}

function stop()
{
    echo "Stop $AppName"

	PID=""
	query(){
		PID=`ps -ef |grep java|grep $AppName|grep -v grep|awk '{print $2}'`
	}

	query
	if [ x"$PID" != x"" ]; then
		kill -TERM $PID
		echo "$AppName (pid:$PID) exiting..."
		while [ x"$PID" != x"" ]
		do
			sleep 1
			query
		done
		echo "$AppName exited."
	else
		echo "$AppName already stopped."
	fi
}

function restart()
{
    stop
    sleep 5
    start
}

function status()
{
    PID=`ps -ef |grep java|grep $AppName|grep -v grep|wc -l`
    if [ $PID != 0 ];then
        echo "$AppName is running..."
    else
        echo "$AppName is not running..."
    fi
}

case $1 in
    start)
    start;;
    stop)
    stop;;
    restart)
    restart;;
    status)
    status;;
    *)

esac

### 注册数据源

url :
http://host:port/data-source/register_api?time={时间戳}&sign={签名}

method: post

application/json:

```json
{
  "dataKey": "唯一标识",
  "source":"来源，无特殊意义，只是标识",
  "url":"数据源的url",
  "chargeable":false,
  "fields": [
    {"name": "age","type":"INT","description":"年龄"}
  ]
}
```

返回值:
```json
{
  "errcode":200,
  "errmsg": ""
}
```


* chargeable  是否需要花钱
* type   STRING/INT/DOUBLE/BOOL/LIST_STRING
* time 毫秒级别的时间戳
* sign 调用签名
* errcode 200成功

```python
签名算法 md5({uri}@{time}@appKey)

例如：
uri=/api/v1/call
time=1656424120985
appKey=1111111111
sign= md5(/api/v1/callRule1@1656424120985@1111111111)
```

> 该接口具备幂等性，可多次调用

### 调用规则引擎

url :
http://host:port/api/v1/callRule?time={时间戳}&sign={签名}&uid={uid}&transactionId={txId}&event={event}

method: post




* uid  用户标识，便于统计的，如果没有，可以传0
* txId   进件的唯一标识
* event 事件名（决策引擎定义的事件）
* time 同上
* sign 同上


返回值
```json

{
  "code":200,
  "errorMsg":"",
  "data":{
    "id":1,
    "name":"印尼_v1_1204",
    "score":1,
    "status":"REFUSE"
  }
}

```

* code:200成功
* data.status  REFUSE, PASS, HINT, UNKNOWN, NONE, SKIPPED, ERROR



### 规则引擎调用数据源

url : 数据源自定

method : post

application/json

```json
{
  "dataKey":["数据源唯一标识1","数据源唯一标识2"],
  "transactionId": 10000
}
```

* dataKey 需要查询的数据源的key
* transactionId 进件唯一标识

返回值:
```json
{
  "code": 200,
  "data": {
    "dataKey": {
      "age": 28
    },
    "dataKey2": {
      "smsCount": 100
    }
  }
}
```
* code 200成功
* dataKey, dataKey2,根据请求返回的对应的数据

> 如果数据没查到，可不返回，规则引擎里面需要处理缺省值的情况，实际业务中，不建议这样（这会增加风控团队维护的成本），建议都给定默认值
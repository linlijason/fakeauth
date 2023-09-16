
SET NAMES utf8mb4;

DROP TABLE IF EXISTS `app_type`;

CREATE TABLE `app_type` (
                            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '应用类型主键',
                            `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '应用类型名称',
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='应用类型';

LOCK TABLES `app_type` WRITE;

INSERT INTO `app_type` (`id`, `name`)
VALUES
    (1,'H5-Android'),
    (2,'H5-iOS');

UNLOCK TABLES;



DROP TABLE IF EXISTS `business_event`;

CREATE TABLE `business_event` (
                                  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '事件主键ID',
                                  `event_type_id` bigint(20) unsigned NOT NULL COMMENT '事件类型ID',
                                  `app_type_id` bigint(20) unsigned NOT NULL COMMENT '应用类型ID',
                                  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '事件名称',
                                  `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                  `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                  `score_operator` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '总得分运算符',
                                  `refuse_score_min` int(11) DEFAULT NULL COMMENT '拒绝分值范围最小值',
                                  `refuse_score_max` int(11) DEFAULT NULL COMMENT '拒绝分值范围最大值',
                                  `pass_score_min` int(11) DEFAULT NULL COMMENT '通过分值范围最小值',
                                  `pass_score_max` int(11) DEFAULT NULL COMMENT '通过分值范围最大值',
                                  `hint_score_min` int(11) DEFAULT NULL COMMENT '存在风险分值范围最小值',
                                  `hint_score_max` int(11) DEFAULT NULL COMMENT '存在风险分值范围最大值',
                                  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='事件定义表';


CREATE TABLE `call_log` (
                            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
                            `event_id` bigint(20) DEFAULT NULL COMMENT '事件 Id',
                            `event_type` varchar(64) DEFAULT NULL COMMENT '事件类型',
                            `event_name` varchar(64) DEFAULT NULL COMMENT '事件名称',
                            `rule_set_id` bigint(10) DEFAULT NULL COMMENT '触发的规则集 Id',
                            `rule_set_name` varchar(128) DEFAULT '' COMMENT '触发的规则集名称',
                            `event_score` bigint(20) DEFAULT NULL COMMENT '事件执行得分',
                            `user_id` varchar(64) DEFAULT NULL COMMENT '用户 Id',
                            `event_result` varchar(64) DEFAULT NULL COMMENT '事件执行结果',
                            `application_id` bigint(20) DEFAULT NULL COMMENT '应用类型 Id',
                            `application_type` varchar(64) DEFAULT NULL COMMENT '应用类型',
                            `event_cost_time` bigint(20) DEFAULT NULL COMMENT '事件耗时',
                            `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `event_type_id` bigint(20) unsigned DEFAULT NULL COMMENT '事件类型ID',
                            `transaction_id` varchar(128) DEFAULT NULL COMMENT '进件号',
                            `rule_set_score` int(11) DEFAULT NULL COMMENT '规则集执行得分',
                            `rule_set_result` varchar(64) DEFAULT NULL COMMENT '规则集执行结果',
                            `rule_set_cost_time` bigint(20) DEFAULT NULL COMMENT '规则集执行耗时',
                            PRIMARY KEY (`id`),
                            KEY `call_log_date_created_IDX` (`date_created`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `event_rule_set_relation`;

CREATE TABLE `event_rule_set_relation` (
                                           `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '事件规则集关系主键',
                                           `event_id` bigint(20) unsigned NOT NULL COMMENT '事件ID（business_event.id）',
                                           `rule_set_id` bigint(20) unsigned NOT NULL COMMENT '规则集ID',
                                           `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                           PRIMARY KEY (`id`),
                                           KEY `event_rule_set_relation_event_id_IDX` (`event_id`) USING BTREE,
                                           KEY `event_rule_set_relation_rule_set_id_IDX` (`rule_set_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='事件和规则集关系表';


DROP TABLE IF EXISTS `event_type`;

CREATE TABLE `event_type` (
                              `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '事件类型主键',
                              `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '事件类型名称',
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='事件类型';


DROP TABLE IF EXISTS `feature_field`;

CREATE TABLE `feature_field` (
                                 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
                                 `feature_source_id` bigint(20) unsigned NOT NULL COMMENT '对应的数据源ID',
                                 `name` varchar(128) NOT NULL COMMENT '字段名称',
                                 `type` varchar(20) NOT NULL COMMENT '字段类型',
                                 `status` varchar(20) NOT NULL DEFAULT '1' COMMENT '字段使用状态',
                                 `description` varchar(256) DEFAULT '' COMMENT '字段描述',
                                 `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                 `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
                                 PRIMARY KEY (`id`),
                                 KEY `feature_field_feature_source_id_IDX` (`feature_source_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# 转储表 feature_source
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feature_source`;

CREATE TABLE `feature_source` (
                                  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
                                  `name` varchar(128) NOT NULL COMMENT '特征名称',
                                  `url` varchar(256) NOT NULL COMMENT 'HTTP 或 HTTPS 协议的 API 接口',
                                  `method` varchar(8) DEFAULT NULL COMMENT '请求方法: GET 或 POST',
                                  `params` varchar(128) DEFAULT NULL COMMENT '接口参数',
                                  `source` varchar(128) DEFAULT NULL COMMENT '数据源',
                                  `chargeable` tinyint(1) DEFAULT NULL COMMENT '是否为付费数据源',
                                  `description` varchar(256) DEFAULT NULL COMMENT '特征数据源描述',
                                  `date_created` datetime DEFAULT NULL COMMENT '创建时间',
                                  `date_modified` datetime DEFAULT NULL COMMENT '修改时间',
                                  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `logical_operator`;

CREATE TABLE `logical_operator` (
                                    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                                    `name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '逻辑运算符名称',
                                    `script` varchar(512) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '运算符 Groovy 实现',
                                    `description` varchar(512) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '详细描述',
                                    `date_created` datetime DEFAULT NULL COMMENT '创建时间',
                                    `date_modified` datetime DEFAULT NULL COMMENT '更新时间',
                                    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



INSERT INTO `logical_operator` (`id`, `name`, `script`, `description`, `date_created`, `date_modified`)
VALUES
    (1,'大于','${FieldName} > ${ThresholdValue}','大于','2017-08-12 15:34:09','2017-08-12 15:34:12'),
    (2,'小于','${FieldName} < ${ThresholdValue}','小于','2017-08-12 15:34:45','2017-08-12 15:34:48'),
    (3,'大于等于','${FieldName} >= ${ThresholdValue}','大于等于','2017-08-12 16:29:01','2017-08-12 16:29:03'),
    (4,'小于等于','${FieldName} <= ${ThresholdValue}','小于等于','2017-08-12 16:29:52','2017-08-12 16:29:54'),
    (5,'包含','${FieldName}.contains(\"${ThresholdValue}\")','包含','2017-08-12 16:31:26','2017-08-12 16:31:28'),
    (6,'不包含','!${FieldName}.contains(\"${ThresholdValue}\")','不包含','2017-08-12 16:36:28','2017-08-12 16:36:30'),
    (7,'等于','${FieldName} == ${ThresholdValue}','等于','2017-08-12 16:40:02','2017-08-12 16:40:04'),
    (8,'长度等于','${FieldName}.size() == ${ThresholdValue}','长度等于','2017-08-15 14:13:59','2017-08-15 14:14:02'),
    (9,'长度大于','${FieldName}.size() > ${ThresholdValue}','长度大于','2017-08-15 14:14:29','2017-08-15 14:14:31'),
    (10,'长度小于','${FieldName}.size() < ${ThresholdValue}','长度小于','2017-08-15 14:14:57','2017-08-15 14:14:59'),
    (11,'长度不等于','${FieldName}.size() != ${ThresholdValue}','长度不等于','2017-08-15 15:05:20','2017-08-15 15:05:23'),
    (12,'不等于','${FieldName} != ${ThresholdValue}','不等于','2017-08-15 15:06:02','2017-08-15 15:06:04'),
    (13,'以 x 开头','${FieldName}.startsWith(\"${ThresholdValue}\")','以 x 开头','2017-08-15 15:13:58','2017-08-15 15:14:00'),
    (14,'长度在 [min, max] 之间','def min = ${ThresholdValue}[0]\ndef max = ${ThresholdValue}[1]\n${FieldName}.size() >= min && ${FieldName}.size() <= max','长度在 [min, max] 之间','2017-08-15 16:04:25','2017-08-15 16:04:27'),
    (15,'年龄在 [min, max] 之间','int parseAge(String idNumber) {\n    int age = 0;\n    Calendar cal = Calendar.getInstance();\n    String year = idNumber.substring(6, 10);\n    int currentYear = cal.get(Calendar.YEAR);\n    age = currentYear - Integer.valueOf(year);\n    return age;\n}\n\nint age = parseAge(${FieldName})\nint min = ${ThresholdValue}[0]\nint max = ${ThresholdValue}[1]\n\nage >= min && age <= max','年龄在 [min, max] 之间','2017-08-15 16:19:06','2017-08-15 16:19:08'),
    (16,'除最后一位全部为数字','boolean isNumber(String str)\n{\n    str = str[0..-2]\n    try {\n        Long.parseLong(str);\n        return true;\n    } catch(Exception e) {\n        return false;\n    }\n}\n${ThresholdValue}\nisNumber(${FieldName})','除最后一位全部为数字','2017-08-15 16:25:42','2017-08-15 16:25:44'),
    (17,'字符串等于','${FieldName} == \"${ThresholdValue}\"','字符串等于','2017-08-15 16:32:52','2017-08-15 16:32:54'),
    (18,'在区间 [min, max] 之间','def min = ${ThresholdValue}[0]\ndef max = ${ThresholdValue}[1]\n${FieldName} >= min && ${FieldName} <= max','在区间 [min, max] 之间','2017-08-15 17:00:38','2017-08-15 17:00:39'),
    (19,'不以 x 开头','!${FieldName}.startsWith(\"${ThresholdValue}\")','不以 x 开头','2017-08-16 16:01:18','2017-08-16 16:01:22'),
    (20,'长度不在 [min, max] 之间','def min = ${ThresholdValue}[0]\ndef max = ${ThresholdValue}[1]\n!(${FieldName}.size() >= min && ${FieldName}.size() <= max)','长度不在 [min, max] 之间','2017-08-16 16:02:56','2017-08-16 16:02:58'),
    (21,'年龄不在 [min, max] 之间','int parseAge(String idNumber) {\n    int age = 0;\n    Calendar cal = Calendar.getInstance();\n    String year = idNumber.substring(6, 10);\n    int currentYear = cal.get(Calendar.YEAR);\n    age = currentYear - Integer.valueOf(year);\n    return age;\n}\n\nint age = parseAge(${FieldName})\nint min = ${ThresholdValue}[0]\nint max = ${ThresholdValue}[1]\n\n !(age >= min && age <= max)','年龄不在 [min, max] 之间','2017-08-16 16:03:36','2017-08-16 16:03:39'),
    (22,'字符串不等于','${FieldName} != \"${ThresholdValue}\"','字符串不等于','2017-08-16 16:04:55','2017-08-16 16:04:58'),
    (23,'除最后一位不全部为数字','boolean isNumber(String str)\n{\n    str = str[0..-2]\n    try {\n        Long.parseLong(str);\n        return true;\n    } catch(Exception e) {\n        return false;\n    }\n}\n${ThresholdValue}\n!isNumber(${FieldName})','除最后一位不全部为数字','2017-08-16 16:05:42','2017-08-16 16:05:44'),
    (24,'正则表达式','def regex = ~\'${ThresholdValue}\'\n${FieldName}.matches(regex)','正则表达式','2017-08-16 16:05:42','2017-08-16 16:05:44');




# 转储表 operation_log
# ------------------------------------------------------------

CREATE TABLE `operation_log` (
                                 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
                                 `content_type` varchar(80) NOT NULL COMMENT '更新内容类型。规则，规则集等等',
                                 `content_id` bigint(20) unsigned DEFAULT NULL COMMENT '更新内容ID',
                                 `content_name` varchar(256) DEFAULT NULL COMMENT '更新内容名称',
                                 `type` varchar(64) NOT NULL COMMENT '操作类型。新增，编辑，删除',
                                 `operator` varchar(100) NOT NULL COMMENT '操作人username',
                                 `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
                                 `launch_time` datetime DEFAULT NULL COMMENT '预上线时间',
                                 `status` varchar(45) DEFAULT NULL COMMENT '审核状态',
                                 `event_message` text COMMENT '存储当前事件详细信息',
                                 `role` varchar(30) DEFAULT NULL COMMENT '角色名称',
                                 PRIMARY KEY (`id`),
                                 KEY `operation_log_date_created_IDX` (`date_created`) USING BTREE,
                                 KEY `operation_log_operator_IDX` (`operator`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='操作日志表';


DROP TABLE IF EXISTS `rule`;

CREATE TABLE `rule` (
                        `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
                        `name` varchar(128) DEFAULT NULL COMMENT '规则名称',
                        `category` varchar(64) DEFAULT NULL COMMENT '规则类型',
                        `field_id` bigint(10) DEFAULT NULL COMMENT '规则对应的字段 Id',
                        `field_name` varchar(128) DEFAULT '' COMMENT '规则对应的字段名称',
                        `operator_id` bigint(20) DEFAULT NULL COMMENT '逻辑运算符 Id',
                        `operator_name` varchar(64) DEFAULT NULL COMMENT '逻辑运算符名称',
                        `threshold_value` varchar(64) DEFAULT NULL COMMENT '阈值',
                        `hit_score` int(11) DEFAULT NULL COMMENT '规则执行命中分数',
                        `not_hit_score` int(11) DEFAULT NULL COMMENT '规则执行未命中分数',
                        `unknown_score` int(11) DEFAULT NULL COMMENT '不满足规则对应条件分数',
                        `description` varchar(256) DEFAULT '' COMMENT '规则描述',
                        `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                        `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
                        `expr_json_text` varchar(5000) DEFAULT NULL COMMENT '(多个)特征字段の逻辑运算表达式json格式字符串',
                        PRIMARY KEY (`id`),
                        KEY `rule_name_IDX` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `rule_execution_log` (
                                      `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
                                      `call_log_id` bigint(20) NOT NULL COMMENT '调用日志 Id',
                                      `rule_id` bigint(20) DEFAULT NULL COMMENT '规则 Id',
                                      `rule_name` varchar(64) DEFAULT NULL COMMENT '规则名称',
                                      `rule_set_id` bigint(20) DEFAULT NULL COMMENT '规则集 Id',
                                      `rule_set_name` varchar(64) DEFAULT NULL COMMENT '规则集名称',
                                      `rule_status` varchar(64) DEFAULT NULL COMMENT '规则执行结果',
                                      `rule_score` int(11) DEFAULT NULL COMMENT '规则执行分数',
                                      `rule_field_id` int(11) DEFAULT NULL COMMENT '规则字段 Id',
                                      `rule_field_name` varchar(64) DEFAULT NULL COMMENT '规则字段名称',
                                      `rule_field_value` varchar(64) DEFAULT NULL COMMENT '规则字段值',
                                      `cost_time` bigint(20) DEFAULT NULL COMMENT '耗时',
                                      `date_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                      `rule_field_ids` varchar(300) DEFAULT NULL COMMENT '规则字段 Id(多个)',
                                      `rule_field_names` varchar(1000) DEFAULT NULL COMMENT '规则字段名称(多个)',
                                      `rule_field_values` varchar(2000) DEFAULT NULL COMMENT '规则字段值(多个)',
                                      PRIMARY KEY (`id`),
                                      KEY `rule_execution_log_call_log_id_IDX` (`call_log_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




CREATE TABLE `rule_relation` (
                                 `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
                                 `rule_set_id` bigint(20) DEFAULT NULL COMMENT '规则集 ID',
                                 `rule_id` bigint(20) DEFAULT NULL COMMENT '规则 ID',
                                 `hit_child_rule_id` bigint(4) DEFAULT NULL COMMENT '规则命中跳转到规则',
                                 `not_hit_child_rule_id` bigint(11) DEFAULT NULL COMMENT '规则未命中跳转到规则',
                                 `unknown_child_rule_id` bigint(20) DEFAULT NULL COMMENT '不满足规则执行条件跳转到规则',
                                 `level` int(11) DEFAULT NULL COMMENT '树层级',
                                 PRIMARY KEY (`id`),
                                 KEY `rule_relation_rule_set_id_IDX` (`rule_set_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



DROP TABLE IF EXISTS `rule_set`;

CREATE TABLE `rule_set` (
                            `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                            `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '规则集名称',
                            `type` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '规则集类型',
                            `refuse_score_min` int(11) DEFAULT NULL COMMENT '拒绝分值范围最小值',
                            `refuse_score_max` int(11) DEFAULT NULL COMMENT '拒绝分值范围最大值',
                            `pass_score_min` int(11) DEFAULT NULL COMMENT '通过分值范围最小值',
                            `pass_score_max` int(11) DEFAULT NULL COMMENT '通过分值范围最大值',
                            `hint_score_min` int(11) DEFAULT NULL COMMENT '存在风险分值范围最小值',
                            `hint_score_max` int(11) DEFAULT NULL COMMENT '存在风险分值范围最大值',
                            `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
                            `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            `time_start` time DEFAULT NULL COMMENT '一天内执行时间段起点',
                            `time_stop` time DEFAULT NULL COMMENT '一天内执行时间段终点',
                            `date_begin` date DEFAULT NULL COMMENT '开始启用日期',
                            `date_end` date DEFAULT NULL COMMENT '终止启用日期',
                            PRIMARY KEY (`id`),
                            KEY `rule_set_name_IDX` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='规则集定义表';


DROP TABLE IF EXISTS `rule_set_transition`;

CREATE TABLE `rule_set_transition` (
                                       `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                                       `src_set_id` bigint(20) unsigned DEFAULT NULL COMMENT '源节点规则集主键ID',
                                       `dst_set_id` bigint(20) unsigned DEFAULT NULL COMMENT '目的(下一个)节点规则集主键ID',
                                       `root_set_id` bigint(20) unsigned DEFAULT NULL COMMENT '跳转路径root节点规则集主键ID',
                                       `score_min` int(11) DEFAULT NULL COMMENT '跳转条件分值范围最小值',
                                       `score_max` int(11) DEFAULT NULL COMMENT '跳转条件分值范围最大值',
                                       `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
                                       `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       PRIMARY KEY (`id`),
                                       KEY `rule_set_transition_src_set_id_IDX` (`src_set_id`) USING BTREE,
                                       KEY `rule_set_transition_dst_set_id_IDX` (`dst_set_id`) USING BTREE,
                                       KEY `rule_set_transition_root_set_id_IDX` (`root_set_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='规则集之间跳转关系表';


DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
                        `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                        `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
                        `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                        `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1, 有效; 0: 无效',
                        `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
                        `date_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        `is_super` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否超级管理员',
                        `role` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '角色名称',
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `user_UN` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `username`, `password`, `status`, `date_created`, `date_modified`, `is_super`, `role`)
VALUES
    (1,'admin','705522b695cbcfcebe539350595fc05c',1,'2017-07-26 02:41:38','2021-11-25 13:15:13',1,'SUPERUSER');

UNLOCK TABLES;


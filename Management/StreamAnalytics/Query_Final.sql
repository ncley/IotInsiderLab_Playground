WITH minuteswindow AS
(
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM devicemessages Timestamp by EventEnqueuedUtcTime
    GROUP BY HOPPINGWINDOW (Duration(mi,5), Hop(ss, 30)), IoTHub.ConnectionDeviceId
),
hourswindow AS
(
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM devicemessages Timestamp by EventEnqueuedUtcTime
    GROUP BY HOPPINGWINDOW (Duration(hh,1), Hop(mi, 5)), IoTHub.ConnectionDeviceId
),
daywindow AS
(
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM devicemessages Timestamp by EventEnqueuedUtcTime
    GROUP BY HOPPINGWINDOW (Duration(dd,1), Hop(hh, 1)), IoTHub.ConnectionDeviceId
),
minutesTotals AS
(
    Select
        '5' as windowUnit,
        'minute' as windowSize,
        AVG(messageCount),
        MIN(messageCount),
        MAX(messageCount),
        SUM(messageCount), 
        System.Timestamp AS windowEndTime
    FROM minutesWindow
    GROUP BY HOPPINGWINDOW (Duration(mi,5), Hop(ss, 30))
),
hoursTotals AS
(
    Select
        '1' as windowUnit,
        'hour' as windowSize,
        AVG(messageCount),
        MIN(messageCount),
        MAX(messageCount),
        SUM(messageCount), 
        System.Timestamp AS windowEndTime
    FROM hoursWindow
    GROUP BY HOPPINGWINDOW (Duration(hh,1), Hop(mi, 5))
),
dayTotals AS
(
    Select
        '1' as windowUnit,
        'day' as windowSize,
        AVG(messageCount),
        MIN(messageCount),
        MAX(messageCount),
        SUM(messageCount), 
        System.Timestamp AS windowEndTime
    FROM daywindow
    GROUP BY HOPPINGWINDOW (Duration(dd,1), Hop(hh, 1))
)

--upsert device records with most recent window counts
Select
    dw.deviceId as id,
    dw.messageCount as oneDayCount,
    dw.Time as OneDayCountTime
into
    deviceday
FROM
    daywindow dw

Select
    hw.deviceId as id,
    hw.messageCount as oneHourCount,
    hw.Time as OneHourCountTime
into
    devicehours
FROM
    hourswindow hw

Select
    mw.deviceId as id,
    mw.messageCount as fiveMinuteCount,
    mw.Time as fiveMinuteCountTime
into
    deviceminutes
FROM
    minuteswindow mw

--insert per device message counts for each new window
Select
    CONCAT(deviceid, '_day_1_', CAST(time as nvarchar(max))) as id,
    'day' as windowSize,
    1 as windowUnit,
    deviceId,
	messageCount,
    time
into devicemessagecounts
FROM daywindow
UNION
Select
    CONCAT(deviceid, '_hour_1_', CAST(time as nvarchar(max))) as id,
    'hour' as windowSize,
    1 as windowUnit,
    deviceId,
	messageCount,
    time
FROM hourswindow
UNION
Select
    CONCAT(deviceid, '_minute_5_', CAST(time as nvarchar(max))) as id,
    'minute' as windowSize,
    5 as windowUnit,
    deviceId,
	messageCount,
    time
FROM minuteswindow

--insert stats record for each new window
Select
    CONCAT(windowSize, '_', windowUnit, '_', CAST(windowEndTime as nvarchar(max))) as id,
	windowUnit,
	windowSize,
	Avg,
	Min,
	Max,
	Sum,
	windowEndTime
into stats        
FROM daytotals
UNION
Select
    CONCAT(windowSize, '_', windowUnit, '_', CAST(windowEndTime as nvarchar(max))) as id,
    windowUnit,
    windowSize,
    Avg,
    Min,
    Max,
    Sum,
    windowEndTime
FROM hourstotals
UNION
Select
    CONCAT(windowSize, '_', windowUnit, '_', CAST(windowEndTime as nvarchar(max))) as id,
    windowUnit,
    windowSize,
    Avg,
    Min,
    Max,
    Sum,
    windowEndTime
FROM minutestotals

--create alert records if a device greatly exceeds to average for that period
Select
    CONCAT(dw.deviceid, '_day_1_', CAST(dw.time as nvarchar(max))) as id,
    dw.deviceId,
    'medium' as severity,
    'false' as acknowledged,
    dw.messageCount as deviceMessageCount,
    dt.avg as allDevicesAverage,
    dw.Time,
    'Message Count for device is 4x average for all devices during time period' as reason
into alerts
FROM dayWindow dw
    INNER JOIN daytotals dt ON dw.Time = dt.windowEndTime AND DATEDIFF(ss, dw, dt)=0
WHERE dw.messageCount > (dt.Avg * 4)
UNION
Select
    CONCAT(hw.deviceid, '_minute_5_', CAST(hw.time as nvarchar(max))) as id,
    hw.deviceId,
    'medium' as severity,
    'false' as acknowledged,
    hw.messageCount as deviceMessageCount,
    ht.avg as allDevicesAverage,
    hw.Time,
    'Message Count for device is 4x average for all devices during time period' as reason
FROM minutesWindow hw
    INNER JOIN minutestotals ht ON hw.Time = ht.windowEndTime AND DATEDIFF(ss, hw, ht)=0
WHERE hw.messageCount > (ht.Avg * 4)
UNION
Select
    CONCAT(mw.deviceid, '_minute_5_', CAST(mw.time as nvarchar(max))) as id,
    mw.deviceId,
    'medium' as severity,
    'false' as acknowledged,
    mw.messageCount as deviceMessageCount,
    mt.avg as allDevicesAverage,
    mw.Time,
    'Message Count for device is 4x average for all devices during time period' as reason
FROM minutesWindow mw
    INNER JOIN minutestotals mt ON mw.Time = mt.windowEndTime AND DATEDIFF(ss, mw, mt)=0
WHERE mw.messageCount > (mt.Avg * 4)
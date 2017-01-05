WITH minuteswindow AS
(
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM iothub
    GROUP BY SlidingWindow(mi, 5), IoTHub.ConnectionDeviceId
)
-- ,hourwindow AS
-- (
    -- SELECT 
        -- IoTHub.ConnectionDeviceId as deviceId,
        -- COUNT(*) as messageCount,
        -- System.TimeStamp AS Time
    -- FROM iothub
    -- GROUP BY SlidingWindow(hh, 1), IoTHub.ConnectionDeviceId
-- ),
-- ,daywindow AS
-- (
    -- SELECT 
        -- IoTHub.ConnectionDeviceId as deviceId,
        -- COUNT(*) as messageCount,
        -- System.TimeStamp AS Time
    -- FROM iothub
    -- GROUP BY SlidingWindow(dd, 1), IoTHub.ConnectionDeviceId
-- ),
-- ,dayswindow AS
-- (
    -- SELECT 
        -- IoTHub.ConnectionDeviceId as deviceId,
        -- COUNT(*) as messageCount,
        -- System.TimeStamp AS Time
    -- FROM iothub
    -- GROUP BY SlidingWindow(dd, 7), IoTHub.ConnectionDeviceId
-- )


-- Select
    -- mw.deviceId as id,
    -- mw.messageCount as fiveMinuteCount
-- FROM
    -- iothub
-- JOIN minuteswindow mw
    -- ON DATEDIFF(ss, mw, iothub)=0
    -- AND iothub.IoTHub.ConnectionDeviceId = mw.deviceId
	
Select
	'alldevices' as id,
    AVG(mw.messageCount)
FROM
    iothub
JOIN minuteswindow mw
    ON DATEDIFF(ss, mw, iothub)=0
    AND iothub.IoTHub.ConnectionDeviceId = mw.deviceId


	
	=====================================
	
	WITH minuteswindow AS
(
    SELECT 
        [IoTHub.ConnectionDeviceId] as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM iothub
    GROUP BY TumblingWindow(mi, 5), IoTHub.ConnectionDeviceId
)


Select
    mw.deviceId as id,
    mw.messageCount as fiveMinuteCount
into
    out1
FROM
    minuteswindow mw



Select
	'alldevices' as id,
    AVG(mw.messageCount)
into out2
FROM
    --iothub
--JOIN 
minuteswindow mw
--    ON DATEDIFF(ss, mw, iothub)=0
  --  AND iothub.IoTHub.ConnectionDeviceId = mw.deviceId
GROUP BY TumblingWindow(mi, 5)

==================================
Select
	'alldevices' as id,
    AVG(mw.messageCount),
    System.Timestamp AS Time
into out2
FROM
    --iothub
--JOIN 
minuteswindow mw
--    ON DATEDIFF(ss, mw, iothub)=0
  --  AND iothub.IoTHub.ConnectionDeviceId = mw.deviceId
GROUP BY TumblingWindow(mi, 5)

=======================
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM devicemessages Timestamp by EventEnqueuedUtcTime
    GROUP BY TumblingWindow(ss, 5), IoTHub.ConnectionDeviceId
=======================================
WITH minuteswindow AS
(
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM devicemessages Timestamp by EventEnqueuedUtcTime
    GROUP BY TumblingWindow(mi, 1), IoTHub.ConnectionDeviceId
)

Select
    mw.deviceId as id,
    mw.messageCount as fiveMinuteCount,
    mw.Time
into
    out1
FROM
    minuteswindow mw

Select
	'alldevices' as id,
    AVG(mw.messageCount),
    MIN(mw.messageCount),
    MAX(mw.messageCount),
    SUM(mw.messageCount),
    System.Timestamp AS Time
into out2
FROM minuteswindow mw
GROUP BY TumblingWindow(mi, 1)    
==================================
WITH minuteswindow AS
(
    SELECT 
        IoTHub.ConnectionDeviceId as deviceId,
        COUNT(*) as messageCount,
        System.TimeStamp AS Time
    FROM devicemessages Timestamp by EventEnqueuedUtcTime
    GROUP BY HOPPINGWINDOW (Duration(mi,5), Hop(ss, 30)), IoTHub.ConnectionDeviceId
)

Select
    mw.deviceId as id,
    mw.messageCount as fiveMinuteCount,
    mw.Time
into
    out1
FROM
    minuteswindow mw

Select
	'alldevices' as id,
    AVG(mw.messageCount),
    MIN(mw.messageCount),
    MAX(mw.messageCount),
    SUM(mw.messageCount),
    System.Timestamp AS Time
into out2
FROM minuteswindow mw
GROUP BY HOPPINGWINDOW (Duration(mi,5), Hop(ss, 30))    
==================================================================
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
)

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


Select
	'alldevices' as id,
    AVG(mw.messageCount) as fiveMinuteAvg,
    MIN(mw.messageCount) as fiveMinuteMin,
    MAX(mw.messageCount) as fiveMinuteMax,
    SUM(mw.messageCount) as fiveMinuteSum,
    System.Timestamp AS Time
into allminutes
FROM minuteswindow mw
GROUP BY HOPPINGWINDOW (Duration(mi,5), Hop(ss, 30))    

Select
	'alldevices' as id,
    AVG(hw.messageCount) as oneHourAvg,
    MIN(hw.messageCount) as oneHourMin,
    MAX(hw.messageCount) as oneHourMax,
    SUM(hw.messageCount) as oneHourSum,
    System.Timestamp AS Time
into allhours
FROM hourswindow hw
GROUP BY HOPPINGWINDOW (Duration(hh,1), Hop(mi, 5))

Select
	'alldevices' as id,
    AVG(dw.messageCount) as oneDayAvg,
    MIN(dw.messageCount) as oneDayMin,
    MAX(dw.messageCount) as oneDayMax,
    SUM(dw.messageCount) as oneDaySum,
    CollectTop(1) OVER (ORDER BY messageCount DESC) as topProducer, 
    System.Timestamp AS Time
into alldays
FROM daywindow dw
GROUP BY HOPPINGWINDOW (Duration(dd,1), Hop(hh, 1))
==================================================================================
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
dayTotals AS
(
    Select
        '1' as windowUnit,
        'day' as windowSize,
        AVG(dw.messageCount),
        MIN(dw.messageCount),
        MAX(dw.messageCount),
        SUM(dw.messageCount), 
        CollectTop(1) OVER (ORDER BY messageCount DESC) as topProducerList, 
        System.Timestamp AS windowEndTime
    FROM daywindow dw
    GROUP BY HOPPINGWINDOW (Duration(dd,1), Hop(hh, 1))
),
dayTotalsFlat AS
(
    Select
        windowUnit,
        windowSize,
        Avg,
        Min,
        Max,
        Sum,
        GetArrayElement(topProducerList, 0) as topProducer,
        windowEndTime
    FROM daytotals
)

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


Select
	'alldevices' as id,
    AVG(mw.messageCount) as fiveMinuteAvg,
    MIN(mw.messageCount) as fiveMinuteMin,
    MAX(mw.messageCount) as fiveMinuteMax,
    SUM(mw.messageCount) as fiveMinuteSum,
    System.Timestamp AS Time
into allminutes
FROM minuteswindow mw
GROUP BY HOPPINGWINDOW (Duration(mi,5), Hop(ss, 30))    

Select
	'alldevices' as id,
    AVG(hw.messageCount) as oneHourAvg,
    MIN(hw.messageCount) as oneHourMin,
    MAX(hw.messageCount) as oneHourMax,
    SUM(hw.messageCount) as oneHourSum,
    System.Timestamp AS Time
into allhours
FROM hourswindow hw
GROUP BY HOPPINGWINDOW (Duration(hh,1), Hop(mi, 5))


Select
    windowUnit,
    windowSize,
    Avg,
    Min,
    Max,
    Sum,
    topProducer.value.deviceid,
    windowEndTime
into alldays
FROM daytotalsflat
==========================
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
        CollectTop(1) OVER (ORDER BY messageCount DESC) as topProducerList, 
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
        CollectTop(1) OVER (ORDER BY messageCount DESC) as topProducerList, 
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
        CollectTop(1) OVER (ORDER BY messageCount DESC) as topProducerList, 
        System.Timestamp AS windowEndTime
    FROM daywindow
    GROUP BY HOPPINGWINDOW (Duration(dd,1), Hop(hh, 1))
),
totalsFlat AS
(
    Select
        windowUnit,
        windowSize,
        Avg,
        Min,
        Max,
        Sum,
        GetArrayElement(topProducerList, 0) as topProducer,
        windowEndTime
    FROM daytotals
    UNION
        Select
        windowUnit,
        windowSize,
        Avg,
        Min,
        Max,
        Sum,
        GetArrayElement(topProducerList, 0) as topProducer,
        windowEndTime
    FROM hourstotals
    UNION
        Select
        windowUnit,
        windowSize,
        Avg,
        Min,
        Max,
        Sum,
        GetArrayElement(topProducerList, 0) as topProducer,
        windowEndTime
    FROM minutestotals    
)

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

Select
    windowUnit,
    windowSize,
    Avg,
    Min,
    Max,
    Sum,
    topProducer.value.deviceid as topProducer,
    windowEndTime
into allAggregations
FROM totalsflat

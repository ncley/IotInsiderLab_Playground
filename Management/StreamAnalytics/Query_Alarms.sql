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

Select
	windowUnit,
	windowSize,
	Avg,
	Min,
	Max,
	Sum,
	windowEndTime
into allAggregations        
FROM daytotals
UNION
	Select
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
        windowUnit,
        windowSize,
        Avg,
        Min,
        Max,
        Sum,
        windowEndTime
FROM minutestotals

Select
    mw.deviceId,
    mw.messageCount,
    mt.avg,
    mw.Time
into alarms
FROM minutesWindow mw
INNER JOIN minutestotals mt ON mw.Time = mt.windowEndTime
AND DATEDIFF(ss, mw, mt)=0
WHERE mw.messageCount > (mt.Avg * 4)
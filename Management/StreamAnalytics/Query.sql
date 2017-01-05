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
    devicedayout
FROM
    daywindow dw

Select
    hw.deviceId as id,
    hw.messageCount as oneHourCount,
    hw.Time as OneHourCountTime
into
    devicehoursout
FROM
    hourswindow hw

Select
    mw.deviceId as id,
    mw.messageCount as fiveMinuteCount,
    mw.Time as fiveMinuteCountTime
into
    deviceminutesout
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
    System.Timestamp AS Time
into alldays
FROM daywindow dw
GROUP BY HOPPINGWINDOW (Duration(dd,1), Hop(hh, 1))
    
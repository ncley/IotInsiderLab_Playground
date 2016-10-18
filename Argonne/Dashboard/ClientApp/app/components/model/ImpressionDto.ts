
    import ForImpressionDto = require("./FaceForImpressionDto");

    export class ImpressionDto {
        constructor(public impressionId: number, public deviceId: string, public messageId: string, public displayedAdId: string, public campaignId: string, public deviceTimestamp: Date, public insertTimestamp: Date, public faces: ForImpressionDto.FaceForImpressionDto[]) {
        }
    }
 
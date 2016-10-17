
    export class FaceForImpressionDto {
        constructor(public impressionId: number, public faceId: string, public sequence: number, public age: number, public gender: string, public scoreAnger: number, public scoreContempt: number, public scoreDisgust: number, public scoreFear: number, public scoreHappiness: number, public scoreNeutral: number, public scoreSadness: number, public scoreSurprise: number) {
        }
    }
 
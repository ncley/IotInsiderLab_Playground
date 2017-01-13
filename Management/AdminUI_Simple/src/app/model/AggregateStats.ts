
export class AggregateStats {
    constructor(
        public id: string,
        public windowunit: number,
        public windowsize: string,
        public median: number,
        public avg: number,
        public min: number,
        public max: number,
        public sum: number,
        public windowendtime:Date,
         ) {
    }
}

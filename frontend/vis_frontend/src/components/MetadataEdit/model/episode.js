import UUID from "uuid-js";

class Episode {
    static count = 1;
    constructor(ep, plot) {
        this.id = UUID.create().toString();
        this.ep = ep || 1;
        this.plot = plot || "";
        this.frequent_pattern = new Map();
        this.order = Episode.count++;
    }

    toString() {
        return new String(this.ep);
    }

    toJSON() {
        return {
            index: this.id,
            FP: this.frequent_pattern,
            plot: this.plot
        }
    }
}

export default Episode;
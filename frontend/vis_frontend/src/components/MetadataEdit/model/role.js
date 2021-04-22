class Role {
    static count = 0;
    active = false;
    constructor(name) {
        this.id = Role.count++;
        this.name = name;
        this.aliases = []; //aliases是Array(Alias)
    }

    toJSON() {
        return {
            [this.name]: this.aliases.map(item => item.toString())
        }
    }
}

class Alias {
    static count = 0;
    editing = false;
    constructor(name) {
        this.name = name;
        this.id = Alias.count++;
    }

    toString() {
        return this.name;
    }
}

export { Role, Alias };
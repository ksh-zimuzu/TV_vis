class Role {
    static count = 0;
    active = false;
    constructor(name) {
        this.id = Role.count++;
        this.name = name;
        this.aliases = []; //aliases是Array(Alias)
    }
}

class Alias {
    static count = 0;
    editing = false;
    constructor(name) {
        this.name = name;
        this.id = Alias.count++;
    }
}

export { Role, Alias };
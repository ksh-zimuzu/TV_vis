function roleArray2dict(roleArray) {
    let res = {};
    for (const role of roleArray) {
        res[role.name] = role.aliases.map((item) => item.name);
    }
    return res;
}

export { roleArray2dict };
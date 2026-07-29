const stylesMock = new Proxy({}, { get: (_target, key) => String(key) });

export default stylesMock;

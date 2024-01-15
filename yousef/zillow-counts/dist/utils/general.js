"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoordinateGrid = void 0;
const createCoordinateGrid = (mapBounds, gridSize = 2) => {
    const { east, west, north, south } = mapBounds;
    const latitudeRange = east - west;
    const longitudeRange = north - south;
    const grid = [];
    const longitudeStep = longitudeRange / gridSize;
    const latitudeStep = latitudeRange / gridSize;
    for (let lng = south; lng < north; lng += longitudeStep) {
        for (let lat = west; lat < east; lat += latitudeStep) {
            const cell = {
                east: lat + latitudeStep,
                west: lat,
                north: lng + longitudeStep,
                south: lng
            };
            grid.push(cell);
        }
    }
    return grid;
};
exports.createCoordinateGrid = createCoordinateGrid;
//# sourceMappingURL=general.js.map
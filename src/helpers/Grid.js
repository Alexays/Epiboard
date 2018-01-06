import Config from '../../config';

export default class Grid {
    constructor() {
        return Grid.createGridStructure();
    }

    /**
     * Gets the maximum width a column should be
     * @param    {obj} data The column object
     * @return {int}            The width
     */
    static getMaxColumnWidth(data) {
        let maxWidth = 0;

        for (let c = 0; c < data.length; c += 1) {
            for (let b = 0; b < data[c].length; b += 1) {
                if (maxWidth === 0) {
                    maxWidth = data[c][b].x;
                } else if (data[c][b].x > maxWidth) {
                    maxWidth = data[c][b].x;
                }
            }
        }

        return maxWidth;
    }

    /**
     * Gets the maximum height a row should be
     * @param    {obj} data The row object
     * @return {int}            The height
     */
    static getMaxRowHeight(data) {
        let maxHeight = 0;

        for (let c = 0; c < data.length; c += 1) {
            if (maxHeight === 0) {
                maxHeight = data[c].y;
            } else if (data[c].y > maxHeight) {
                maxHeight = data[c].y;
            }
        }

        return maxHeight;
    }

    /**
     * Creates the structure grid object
     * @return {obj} An object which contains data for all the boxes
     */
    static createGridStructure() {
        const fullPadding = Config.gridSettings.padding;
        const borderRadius = Config.gridSettings.borderRadius;
        const boxShadow = Config.gridSettings.boxShadow;
        const halfPadding = Config.gridSettings.padding / 2;
        const layout = Config.gridSettings.layout;
        const noOfColumns = layout.length;
        const boxes = [];

        let maxRowHeight = null;
        let maxColumnWidth = 0;
        let boxWidth = null;

        // Cycles through columns, rows and then boxes

        for (let i = 0; i < noOfColumns; i += 1) {
            for (let c = 0; c < layout[i].length; c += 1) {
                for (let r = 0; r < layout[i][c].length; r += 1) {
                    const box = {
                        component: layout[i][c][r].c,
                        styles: {},
                        wrapperStyles: {}
                    };

                    // If set change the values due to the previous box values

                    if (maxColumnWidth) {
                        box.styles.left = `${maxColumnWidth}%`;
                    }

                    if (maxRowHeight) {
                        box.styles.top = `${maxRowHeight}%`;
                    }

                    if (boxWidth) {
                        box.styles.left = `${boxWidth}%`;
                    }

                    // Set initial box position

                    const boxPosition = {
                        top: `${fullPadding}px`,
                        right: `${fullPadding}px`,
                        bottom: `${fullPadding}px`,
                        left: `${fullPadding}px`
                    };

                    // Column level

                    if (i === 0 && noOfColumns === 1) {
                        // Leave full padding
                    } else if (i === 0 && noOfColumns > 1) {
                        boxPosition.right = `${halfPadding}px`;
                    } else if (i !== 0 && (i + 1) !== noOfColumns) {
                        boxPosition.left = `${halfPadding}px`;
                        boxPosition.right = `${halfPadding}px`;
                    } else {
                        boxPosition.left = `${halfPadding}px`;
                    }

                    // Row level

                    if (c === 0 && layout[i].length === 1) {
                        // Leave padding as is
                    } else if (c === 0 && layout[i].length > 1) {
                        boxPosition.bottom = `${halfPadding}px`;
                    } else if (c !== 0 && (c + 1) !== layout[i].length) {
                        boxPosition.top = `${halfPadding}px`;
                        boxPosition.bottom = `${halfPadding}px`;
                    } else {
                        boxPosition.top = `${halfPadding}px`;
                    }

                    // Box level

                    if (r === 0 && layout[i][c].length === 1) {
                        // Leave padding as is
                    } else if (r === 0 && layout[i][c].length > 1) {
                        boxPosition.right = `${halfPadding}px`;
                    } else if (r !== 0 && (r + 1) !== layout[i][c].length) {
                        boxPosition.left = `${halfPadding}px`;
                        boxPosition.right = `${halfPadding}px`;
                    } else {
                        boxPosition.left = `${halfPadding}px`;
                    }

                    // Add styles to box and box wrapper

                    box.wrapperStyles.top = boxPosition.top;
                    box.wrapperStyles.right = boxPosition.right;
                    box.wrapperStyles.bottom = boxPosition.bottom;
                    box.wrapperStyles.left = boxPosition.left;

                    box.styles.width = `${layout[i][c][r].x}%`;
                    box.styles.height = `${layout[i][c][r].y}%`;
                    box.wrapperStyles.borderRadius = borderRadius;
                    box.wrapperStyles.boxShadow = boxShadow;

                    if ('i' in layout[i][c][r]) {
                        layout[i][c][r].i.forEach((value, key) => {
                            box.wrapperStyles[key] = value;
                        });
                    }

                    box.settings = (typeof layout[i][c][r].s === 'object') ? layout[i][c][r].s : Config.componentSettings[layout[i][c][r].c];
                    box.settings = box.settings || {};

                    boxWidth = layout[i][c][r].x + boxWidth;
                    boxes.push(box);
                }

                boxWidth = null;
                maxRowHeight = Grid.getMaxRowHeight(layout[i][c]);
            }

            maxRowHeight = null;
            maxColumnWidth = Grid.getMaxColumnWidth(layout[i]) + maxColumnWidth;
        }

        return boxes;
    }
}

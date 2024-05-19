import { Dimensions } from "react-native";
const width = Dimensions.get("window").width;

const COLUMN_SIZE = width / 3;
const MIDDLE_MARGIN = 5;
const EDGE_MARGIN = 0;
const IMAGE_SPACING = (2 * MIDDLE_MARGIN + 2 * EDGE_MARGIN) / 3;
const IMAGE_WIDTH = COLUMN_SIZE - IMAGE_SPACING;
const COLUMNS = 3;

export {
  COLUMNS,
  COLUMN_SIZE,
  MIDDLE_MARGIN,
  EDGE_MARGIN,
  IMAGE_SPACING,
  IMAGE_WIDTH,
};

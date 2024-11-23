import { Card, CardContent, Grid, Typography } from "@mui/joy";
import React from "react";

import { gameItemsDictionnary } from "../../../dictionnaries/gameItems.dictionnary";
import { GameResourcesTypeEnum } from "../../../enums/gameResourcesType.enum";
import type { RecipeItemFm } from "../../../types/apis/frontModel/recipeItemFm";
import type { GameItemResource } from "../../../types/gameItems/resource";

type Props = {
  product: RecipeItemFm;
};

export const IngredientCard: React.FC<Props> = ({ product }) => {
  const item = gameItemsDictionnary[product.className];
  const isItemSolid =
    (item as GameItemResource).resourceType === GameResourcesTypeEnum.Solid;

  return (
    <Card
      variant="outlined"
      sx={{
        padding: "3px",
        borderColor:
          Math.floor(product.amount) === 0
            ? "var(--joy-palette-error-main)"
            : "var(--joy-palette-neutral-outlinedBorder)",
        borderWidth: Math.floor(product.currentUsage) === 0 ? "3px" : "1px",
      }}
    >
      <CardContent>
        <Typography
          level="body1"
          alignSelf="center"
          sx={{ paddingTop: "3px", paddingBottom: "2px" }}
        >
          {product.name}
        </Typography>
        <Grid
          spacing={2}
          sx={{ paddingTop: "2px" }}
          container
        >
          <Grid>
            <img
              src={
                item
                  ? `/assets/${item.category}/${product.name}.png`
                  : undefined
              }
              alt={product.name}
              style={{ height: "30px", width: "30px" }}
            />
          </Grid>
          <Grid xs>
            <Grid
              spacing={0}
              container
              sx={{ paddingTop: 0 }}
            >
              <Grid xs>
                <Typography level="body2">Current Consumed</Typography>
              </Grid>
              <Grid>
                <Typography>
                  {`${
                    item && isItemSolid
                      ? product.currentUsage.toFixed(2)
                      : `${Math.round(product.currentUsage / 10) / 100} m³`
                  }/min`}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              spacing={0}
              container
              sx={{ paddingTop: 0 }}
            >
              <Grid xs>
                <Typography level="body2">Max Consumed</Typography>
              </Grid>
              <Grid>
                <Typography>
                  {`${
                    item && isItemSolid
                      ? product.maxUsage.toFixed(2)
                      : `${Math.round(product.maxUsage / 10) / 100} m³`
                  }/min`}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              spacing={0}
              container
              sx={{ paddingTop: 0 }}
            >
              <Grid xs>
                <Typography level="body2">Efficency Consume</Typography>
              </Grid>
              <Grid>
                <Typography>{product.usingPercent.toFixed(2)} %</Typography>
              </Grid>
            </Grid>
            <Grid
              spacing={0}
              container
              sx={{
                color:
                  Math.floor(product.amount) === 0
                    ? "var(--joy-palette-error-main)"
                    : "var(--joy-palette-text-main)",
                paddingY: 0,
              }}
            >
              <Grid xs>
                <Typography level="body2">Input Inventory</Typography>
              </Grid>
              <Grid>
                {item && isItemSolid
                  ? product.amount
                  : `${Math.round(product.amount / 10) / 100} m³`}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

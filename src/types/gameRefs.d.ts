import type { GameRefsCategory } from "../enums/gameRefsCategory.enum";
import type { GameRefsRenamedEnum } from "../enums/gameRefsRenamed.enum";
import type { GameRefsResourceType } from "../enums/gameRefsResourceType.enum";

export type GameRefs = {
  name: GameRefsRenamedEnum;
  category: GameRefsCategory;
  resourceType?: GameRefsResourceType;
};

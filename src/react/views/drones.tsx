import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { BsBatteryHalf, BsBox, BsClockHistory } from "react-icons/bs";

import { DroneFlyingModeEnum } from "../../enums/droneFlyingMode.enum";
import { DroneStationStatusEnum } from "../../enums/droneStationStatus.enum";
import { EndpointEnum } from "../../enums/endpoint.enum";
import { useAutoRefetch } from "../../hooks/useAutoRefetch";
import type { DroneDto } from "../../types/apis/dataTransferObject/droneDto";
import type { DroneStationDto } from "../../types/apis/dataTransferObject/droneStationDto";
import type { DroneFm } from "../../types/apis/frontModel/droneFm";
import type { DroneStationFm } from "../../types/apis/frontModel/droneStationFm";

// Type used only in this file but move it could be good
type DroneStationStep = Record<
  string,
  { homeStation: DroneStationFm; destStation: DroneStationFm }
>;

export const Drones: React.FC = () => {
  const { data: drones } = useAutoRefetch<DroneDto[], DroneFm[]>(
    EndpointEnum.DRONE,
  );
  const { data: droneStations } = useAutoRefetch<
    DroneStationDto[],
    DroneStationFm[]
  >(EndpointEnum.DRONE_STATION);
  const [droneStationStep, setDroneStationStep] = useState<DroneStationStep>();

  const handlePrepareTStationsForUI = useCallback(
    (dronesData: DroneFm[]) => {
      let temporaryStationStep: DroneStationStep = {};
      dronesData.forEach((drone) => {
        const homeStation = droneStations?.find(
          (el) => el.name === drone.homeStation,
        );
        const destStation = droneStations?.find(
          (el) => el.name === drone.pairedStation,
        );

        if (homeStation && destStation) {
          temporaryStationStep = {
            ...temporaryStationStep,
            [drone.id]: {
              homeStation,
              destStation,
            },
          };
        }
      });
      setDroneStationStep(temporaryStationStep);
    },
    [droneStations],
  );

  useEffect(() => {
    if (drones && drones.length > 0) handlePrepareTStationsForUI(drones);
  }, [drones, handlePrepareTStationsForUI]);

  return (
    <Container sx={{ paddingTop: "50px" }}>
      <Card
        variant="outlined"
        sx={{ marginBottom: "30px" }}
      >
        <CardContent>
          <Grid
            container
            display="flex"
            alignItems="center"
          >
            <Grid xs>
              <Typography
                marginBottom="5px"
                level="h2"
                fontWeight={600}
              >
                Drones
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {drones && droneStationStep ? (
        <>
          {drones.map((drone) => {
            if (droneStationStep[drone.id]) {
              const { homeStation, destStation } = droneStationStep[drone.id];

              return (
                <Grid
                  container
                  spacing={2}
                  sx={{ marginBottom: "30px", height: "300px" }}
                  display="flex"
                  alignItems="center"
                  key={drone.id}
                >
                  <Grid
                    xs={3}
                    sx={{ height: "240px" }}
                  >
                    {homeStation ? (
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          marginBottom: "20px",
                          height: "110px",
                          paddingBottom: "0px !important",
                        }}
                      >
                        <CardContent>
                          {/* <BsLink45Deg size="28px"/> */}
                          <img
                            src="./assets/Building/Drone_Port.png"
                            alt="Satisfactory Drone Port illustration"
                            style={{ height: "35px", width: "35px" }}
                          />
                          <Typography
                            level="h6"
                            sx={{ marginTop: "10px" }}
                          >
                            {drone.homeStation}
                          </Typography>

                          <Typography
                            level="body2"
                            sx={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            Home Port
                          </Typography>

                          <Box
                            sx={{
                              position: "absolute",
                              top: "20px",
                              right: "20px",
                            }}
                          >
                            {homeStation.droneStatus ===
                              DroneStationStatusEnum.No_Drone && (
                              <Chip
                                color="info"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                No drones
                              </Chip>
                            )}
                            {homeStation.droneStatus ===
                              DroneStationStatusEnum.Cannot_Unload && (
                              <Chip
                                color="info"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                Inventory Full
                              </Chip>
                            )}
                            {homeStation.droneStatus ===
                              DroneStationStatusEnum.Docking && (
                              <Chip
                                color="info"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                Docked
                              </Chip>
                            )}
                            {homeStation.droneStatus ===
                              DroneStationStatusEnum.Taking_Off && (
                              <Chip
                                color="danger"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                Takeoff
                              </Chip>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ) : null}

                    {destStation ? (
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          height: "110px",
                          paddingBottom: "0px !important",
                        }}
                      >
                        <CardContent>
                          <img
                            src="./assets/Building/Drone_Port.png"
                            alt="Satisfactory Drone Port illustration"
                            style={{ height: "35px", width: "35px" }}
                          />
                          <Typography
                            level="h6"
                            sx={{ marginTop: "10px" }}
                          >
                            {drone.currentDestination === ""
                              ? "N/A"
                              : drone.currentDestination}
                          </Typography>

                          <Typography
                            level="body2"
                            sx={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            Linked Port
                          </Typography>

                          <Box
                            sx={{
                              position: "absolute",
                              top: "20px",
                              right: "20px",
                            }}
                          >
                            {destStation.droneStatus ===
                              DroneStationStatusEnum.No_Drone && (
                              <Chip
                                color="info"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                No drones
                              </Chip>
                            )}
                            {destStation.droneStatus ===
                              DroneStationStatusEnum.Cannot_Unload && (
                              <Chip
                                color="info"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                Inventory Full
                              </Chip>
                            )}
                            {destStation.droneStatus ===
                              DroneStationStatusEnum.Docking && (
                              <Chip
                                color="info"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                Docked
                              </Chip>
                            )}
                            {destStation.droneStatus ===
                              DroneStationStatusEnum.Taking_Off && (
                              <Chip
                                color="danger"
                                size="sm"
                                variant="outlined"
                                sx={{
                                  backgroundColor: "rgba(47, 128, 237, 0.1)",
                                  borderColor: "rgba(47, 128, 237, 0.1)",
                                }}
                              >
                                Takeoff
                              </Chip>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ) : null}
                  </Grid>

                  <Grid
                    xs={3}
                    sx={{ height: "240px", position: "relative" }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        position: "relative",
                        height: "255px",
                        paddingTop: 0,
                      }}
                    >
                      <CardContent>
                        <Stack
                          alignItems="center"
                          sx={{ marginBottom: "15px" }}
                        >
                          <img
                            src="./assets/Vehicle/Drone.png"
                            alt="Satisfactory Drone illustration"
                            style={{ height: "100px" }}
                          />
                          {drone.currentFlyingMode ===
                            DroneFlyingModeEnum.Flying && (
                            <Chip
                              color="info"
                              size="sm"
                              variant="outlined"
                              sx={{
                                backgroundColor: "rgba(47, 128, 237, 0.1)",
                                borderColor: "rgba(47, 128, 237, 0.1)",
                              }}
                            >
                              Flying
                            </Chip>
                          )}
                          {drone.currentFlyingMode ===
                            DroneFlyingModeEnum.Travelling && (
                            <Chip
                              color="info"
                              size="sm"
                              variant="outlined"
                              sx={{
                                backgroundColor: "rgba(47, 128, 237, 0.1)",
                                borderColor: "rgba(47, 128, 237, 0.1)",
                              }}
                            >
                              Flying
                            </Chip>
                          )}
                          {drone.currentFlyingMode ===
                            DroneFlyingModeEnum.None && (
                            <Chip
                              color="info"
                              size="sm"
                              variant="outlined"
                              sx={{
                                backgroundColor: "rgba(47, 128, 237, 0.1)",
                                borderColor: "rgba(47, 128, 237, 0.1)",
                              }}
                            >
                              Pending ...
                            </Chip>
                          )}
                        </Stack>

                        <Grid container>
                          <Grid xs>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                              Next To
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                              {drone.currentDestination}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid xs>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                              Speed
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                              {drone.flyingSpeed < 0
                                ? drone.flyingSpeed * -1
                                : drone.flyingSpeed}{" "}
                              Knots
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid xs>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                              Height (Sealevel)
                            </Typography>
                          </Grid>
                          <Grid>
                            <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                              {(drone.location.z / 100 + 18).toFixed(2)} m
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={6}
                    sx={{ height: "240px" }}
                  >
                    <Grid
                      container
                      sx={{ height: "110px", marginBottom: "40px" }}
                    >
                      <Grid
                        xs={6}
                        sx={{ paddingTop: 0 }}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            height: "110px",
                            paddingBottom: "0px !important",
                          }}
                        >
                          <CardContent>
                            <BsClockHistory
                              size="25px"
                              color="rgba(255,255,255,0.5)"
                            />
                            <Typography
                              level="h4"
                              marginTop="10px"
                            >
                              {homeStation.averageRoundTrip}
                            </Typography>
                            <Typography level="body2">
                              Avg. Round Trip Time
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid
                        xs={6}
                        sx={{ paddingTop: 0 }}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            height: "110px",
                            paddingBottom: "0px !important",
                          }}
                        >
                          <CardContent>
                            <BsClockHistory
                              size="25px"
                              color="rgba(255,255,255,0.5)"
                            />
                            <Typography
                              level="h4"
                              marginTop="10px"
                            >
                              {homeStation.latestRoundTrip}
                            </Typography>
                            <Typography level="body2">
                              Last Round Trip Time
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{ height: "110px" }}
                    >
                      <Grid
                        xs={6}
                        sx={{ paddingTop: 0 }}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            height: "110px",
                            paddingBottom: "0px !important",
                          }}
                        >
                          <CardContent>
                            <BsBatteryHalf
                              size="25px"
                              color="rgba(255,255,255,0.5)"
                            />
                            <Typography
                              level="h4"
                              marginTop="10px"
                            >
                              {homeStation.activeFuel.fuelCostRateEstimation.toFixed(
                                2,
                              )}{" "}
                              / min
                            </Typography>
                            <Typography level="body2">
                              Estimated Battery Rate
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid
                        xs={6}
                        sx={{ paddingTop: 0 }}
                      >
                        <Card
                          variant="outlined"
                          sx={{
                            height: "110px",
                            paddingBottom: "0px !important",
                          }}
                        >
                          <CardContent>
                            <BsBox
                              size="25px"
                              color="rgba(255,255,255,0.5)"
                            />
                            <Typography
                              level="h4"
                              marginTop="10px"
                            >
                              {homeStation.totalTransportRateEstimation.toFixed(
                                2,
                              )}{" "}
                              stacks
                            </Typography>
                            <Typography level="body2">
                              Estimated Transfer Rate (per minute)
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }
            return (
              <Grid
                container
                spacing={2}
                sx={{ marginBottom: "30px", height: "300px" }}
                display="flex"
                alignItems="center"
                key={drone.id}
              >
                <Grid
                  xs={3}
                  sx={{ height: "240px" }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      position: "relative",
                      marginBottom: "20px",
                      height: "110px",
                      paddingBottom: "0px !important",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardContent>
                      <CircularProgress />
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      position: "relative",
                      height: "110px",
                      paddingBottom: "0px !important",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardContent>
                      <CircularProgress />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  xs={3}
                  sx={{ height: "240px", position: "relative" }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      position: "relative",
                      height: "255px",
                      paddingTop: 0,
                    }}
                  >
                    <CardContent>
                      <Stack
                        alignItems="center"
                        sx={{ marginBottom: "15px" }}
                      >
                        <img
                          src="./assets/Vehicle/Drone.png"
                          alt="Satisfactory Drone illustration"
                          style={{ height: "100px" }}
                        />
                        {drone.currentFlyingMode ===
                          DroneFlyingModeEnum.Flying && (
                          <Chip
                            color="info"
                            size="sm"
                            variant="outlined"
                            sx={{
                              backgroundColor: "rgba(47, 128, 237, 0.1)",
                              borderColor: "rgba(47, 128, 237, 0.1)",
                            }}
                          >
                            Flying
                          </Chip>
                        )}
                        {drone.currentFlyingMode ===
                          DroneFlyingModeEnum.Travelling && (
                          <Chip
                            color="info"
                            size="sm"
                            variant="outlined"
                            sx={{
                              backgroundColor: "rgba(47, 128, 237, 0.1)",
                              borderColor: "rgba(47, 128, 237, 0.1)",
                            }}
                          >
                            Flying
                          </Chip>
                        )}
                        {drone.currentFlyingMode ===
                          DroneFlyingModeEnum.Flying && (
                          <Chip
                            color="info"
                            size="sm"
                            variant="outlined"
                            sx={{
                              backgroundColor: "rgba(47, 128, 237, 0.1)",
                              borderColor: "rgba(47, 128, 237, 0.1)",
                            }}
                          >
                            Pending ...
                          </Chip>
                        )}
                      </Stack>

                      <Grid container>
                        <Grid xs>
                          <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                            Next To
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                            {drone.currentDestination}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid xs>
                          <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                            Speed
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                            {drone.flyingSpeed < 0
                              ? drone.flyingSpeed * -1
                              : drone.flyingSpeed}{" "}
                            Knots
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid xs>
                          <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                            Height (Sealevel)
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                            {(drone.location.z / 100 + 18).toFixed(2)} m
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  xs={6}
                  sx={{ height: "240px" }}
                >
                  <Grid
                    container
                    sx={{ height: "110px", marginBottom: "40px" }}
                  >
                    <Grid
                      xs={6}
                      sx={{ paddingTop: 0 }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          height: "110px",
                          paddingBottom: "0px !important",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardContent>
                          <CircularProgress />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid
                      xs={6}
                      sx={{ paddingTop: 0 }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          height: "110px",
                          paddingBottom: "0px !important",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardContent>
                          <CircularProgress />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    sx={{ height: "110px" }}
                  >
                    <Grid
                      xs={6}
                      sx={{ paddingTop: 0 }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          height: "110px",
                          paddingBottom: "0px !important",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardContent>
                          <CircularProgress />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid
                      xs={6}
                      sx={{ paddingTop: 0 }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          position: "relative",
                          height: "110px",
                          paddingBottom: "0px !important",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardContent>
                          <CircularProgress />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ marginBottom: "30px", height: "300px", opacity: 0.5 }}
        >
          <Grid
            xs={3}
            sx={{ height: "240px" }}
          >
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                marginBottom: "20px",
                height: "110px",
                paddingBottom: "0px !important",
              }}
            >
              <CardContent>
                <Skeleton
                  variant="circular"
                  sx={{}}
                  width="35px"
                  height="35px"
                />

                <Skeleton
                  variant="rounded"
                  sx={{ marginTop: "10px", marginBottom: "10px" }}
                  width="120px"
                  height="20px"
                />

                <Skeleton width="80px" />
              </CardContent>
            </Card>

            <Card
              variant="outlined"
              sx={{
                position: "relative",
                height: "110px",
                paddingBottom: "0px !important",
              }}
            >
              <CardContent>
                <Skeleton
                  variant="circular"
                  sx={{}}
                  width="35px"
                  height="35px"
                />

                <Skeleton
                  variant="rounded"
                  sx={{ marginTop: "10px", marginBottom: "10px" }}
                  width="120px"
                  height="20px"
                />

                <Skeleton width="80px" />
              </CardContent>
            </Card>
          </Grid>

          <Grid
            xs={3}
            sx={{ height: "240px", position: "relative" }}
          >
            <Card
              variant="outlined"
              sx={{ position: "relative", height: "255px", paddingTop: 0 }}
            >
              <CardContent>
                <Stack
                  alignItems="center"
                  sx={{ marginBottom: "5px" }}
                >
                  <img
                    src="./assets/Vehicle/Drone.png"
                    alt="Satisfactory Drone illustration"
                    style={{ height: "100px" }}
                  />
                  <Skeleton
                    variant="circular"
                    sx={{ marginTop: "20px", marginBottom: "10px" }}
                    width="80px"
                    height="80px"
                  />

                  <Skeleton width="80px" />
                </Stack>

                <Grid container>
                  <Grid xs>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Next To
                    </Typography>
                  </Grid>
                  <Grid>
                    <Skeleton width="100px" />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Speed
                    </Typography>
                  </Grid>
                  <Grid>
                    <Skeleton width="60px" />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid xs>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Height (Sealevel)
                    </Typography>
                  </Grid>
                  <Grid>
                    <Skeleton width="50px" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            xs={6}
            sx={{ height: "240px" }}
          >
            <Grid
              container
              sx={{ height: "110px", marginBottom: "40px" }}
            >
              <Grid
                xs={6}
                sx={{ paddingTop: 0 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    position: "relative",
                    height: "110px",
                    paddingBottom: "0px !important",
                  }}
                >
                  <CardContent>
                    <Skeleton
                      variant="circular"
                      sx={{}}
                      width="35px"
                      height="35px"
                    />

                    <Skeleton
                      variant="rounded"
                      sx={{ marginTop: "10px", marginBottom: "10px" }}
                      width="120px"
                      height="20px"
                    />

                    <Skeleton width="80px" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={6}
                sx={{ paddingTop: 0 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    position: "relative",
                    height: "110px",
                    paddingBottom: "0px !important",
                  }}
                >
                  <CardContent>
                    <Skeleton
                      variant="circular"
                      sx={{}}
                      width="35px"
                      height="35px"
                    />

                    <Skeleton
                      variant="rounded"
                      sx={{ marginTop: "10px", marginBottom: "10px" }}
                      width="120px"
                      height="20px"
                    />

                    <Skeleton width="80px" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ height: "110px" }}
            >
              <Grid
                xs={6}
                sx={{ paddingTop: 0 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    position: "relative",
                    height: "110px",
                    paddingBottom: "0px !important",
                  }}
                >
                  <CardContent>
                    <Skeleton
                      variant="circular"
                      sx={{}}
                      width="35px"
                      height="35px"
                    />

                    <Skeleton
                      variant="rounded"
                      sx={{ marginTop: "10px", marginBottom: "10px" }}
                      width="120px"
                      height="20px"
                    />

                    <Skeleton width="80px" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={6}
                sx={{ paddingTop: 0 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    position: "relative",
                    height: "110px",
                    paddingBottom: "0px !important",
                  }}
                >
                  <CardContent>
                    <Skeleton
                      variant="circular"
                      sx={{}}
                      width="35px"
                      height="35px"
                    />

                    <Skeleton
                      variant="rounded"
                      sx={{ marginTop: "10px", marginBottom: "10px" }}
                      width="120px"
                      height="20px"
                    />

                    <Skeleton width="80px" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

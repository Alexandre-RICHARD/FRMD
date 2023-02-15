import { Card, Chip, CircularProgress, Container, Divider, Grid, Typography, CardContent, Box } from "@mui/joy"
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { BsBattery, BsBatteryHalf, BsCheck, BsCheck2, BsCloudSlash, BsExclamationCircle, BsExclamationTriangleFill } from "react-icons/bs";

export const PowerMain:React.FC = (props) => {
    const [doLoadData, setLoadData] = useState(true);
    const [power, setPower] = useState<undefined | any>(undefined);

    const theme = useTheme();

    let intervalVar:any;

    const loadData = async () => {
        intervalVar = setInterval( async ()=>{
            const response = await fetch("http://127.0.0.1:8080/getPower");
            const data = await response.text();
            const getPower = JSON.parse(data);
            console.info(getPower);
            setPower(getPower);
        }, 1000)
    };

    useEffect(()=>{
        loadData();

        return function cleanup() {
            console.error("CLEANUP!");
            clearInterval(intervalVar);
        };
    }, [])

    let allCapacity = 0;
    let allProduction = 0;
    let allBatteryCapacity = 0;
    let fuseBroken = false;
    if(power){
        power.forEach((element: any) => {
            allCapacity = allCapacity + element.PowerCapacity;
            allProduction = allProduction + element.PowerProduction;
            allBatteryCapacity = allBatteryCapacity + element.BatteryCapacity;
            if (fuseBroken === false && element.FuseTriggered === true) {
                fuseBroken = true;
            }
        });
    }

    return(
        <Container>
            <Typography level="h3" sx={{marginTop: '30px', marginBottom: '30px'}}>All Power</Typography>
            <Grid container spacing={2} sx={{marginBottom: '30px'}}>
                <Grid xs>
                    <Card>
                        {/* <CardHeader title={allCapacity+ " MW"} subheader="Total Power Capacity"></CardHeader> */}
                        <Typography level="h3">
                            {allCapacity} MW
                        </Typography>
                        <Typography>
                            Total Power Capacity
                        </Typography>
                    </Card>
                </Grid>
                <Grid xs>
                    <Card>
                        {/* <CardHeader title={allProduction+ " MW"} subheader="Total Power Production"></CardHeader> */}
                        <Typography level="h3">
                            {allProduction} MW
                        </Typography>
                        <Typography>
                            Total Production
                        </Typography>
                    </Card>
                </Grid>
                <Grid xs>
                    <Card>
                        {/* <CardHeader title={allBatteryCapacity+ " MW"} subheader="Total Battery Capacity"></CardHeader> */}
                        <Typography level="h3">
                            {allBatteryCapacity} MW
                        </Typography>
                        <Typography>
                            Battery Capacity
                        </Typography>
                    </Card>
                </Grid>
                <Grid xs>
                    {fuseBroken === false ? 
                        <Card sx={{backgroundColor: theme.palette.success.main}}>
                            {/* <CardHeader title="All Good" subheader="Fuse Status"></CardHeader> */}
                            <Typography level="h3">
                                No Problems
                            </Typography>
                            <Typography>
                                Current Status
                            </Typography>
                        </Card>
                    :
                        <Card sx={{backgroundColor: theme.palette.error.main}}>
                            {/* <CardHeader title="Broken!" subheader="Fuse Status"></CardHeader> */}
                            <Typography level="h3">
                                Broken!
                            </Typography>
                            <Typography>
                                Current Status
                            </Typography>
                        </Card>
                    }
                </Grid>
            </Grid>
            <Divider sx={{marginBottom: '50px'}}/>
            <Typography level="h4" sx={{marginTop: '30px', marginBottom: '30px'}}>All Power Circuits</Typography>
            {power ? 
                <>
                    {power.map((powerGroup:any, index:number) => {
                        return(
                            <Card sx={{marginBottom: '30px', padding: '20px', backgroundColor: powerGroup.FuseTriggered === true ? 'var(--joy-palette-danger-solidBg)' : 'var(--joy-palette-background-surface)'}}>
                                <CardContent>
                                <Grid container sx={{marginBottom: '20px'}}>
                                    <Grid xs>
                                        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                            {powerGroup.FuseTriggered === true ? <BsExclamationCircle size={'20px'} style={{marginRight: '10px'}}/> : <></>}
                                            <Typography level="h5" >Power Circuit #{index+1}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid>
                                        {powerGroup.FuseTriggered === true ? <Chip startDecorator={<BsExclamationTriangleFill size={'17px'}/> } sx={{paddingLeft: '6px'}} color="danger" >FUSE BROKEN</Chip> : <Chip startDecorator={<BsCheck size={'22px'}/> } sx={{paddingLeft: '6px', color: 'white'}} color="success">Fuse: All Good</Chip>}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid xs>
                                        <Card variant="outlined">
                                            {/* <CardHeader title={powerGroup.PowerCapacity+ " MW"} subheader="Power Capacity"></CardHeader> */}
                                            <Typography level="h6">
                                                {powerGroup.PowerCapacity} MW
                                            </Typography>
                                            <Typography level="body2">
                                                Power Capacity
                                            </Typography>
                                        </Card>
                                    </Grid>
                                    <Grid xs>
                                        <Card variant="outlined" sx={{backgroundColor: powerGroup.PowerProduction === 0 ? 'var(--joy-palette-danger-solidBg)' : 'var(--joy-palette-background-surface)'}}>
                                            {/* <CardHeader title={powerGroup.PowerProduction+ " MW"} subheader="Power Production"></CardHeader> */}
                                            <Typography level="h6">
                                                {powerGroup.PowerProduction} MW
                                            </Typography>
                                            <Typography level="body2">
                                                Power Production
                                            </Typography>
                                        </Card>
                                    </Grid>
                                    <Grid xs>
                                        <Card variant="outlined">
                                            {/* <CardHeader title={powerGroup.PowerConsumed+ " MW"} subheader="Power Consumed"></CardHeader> */}
                                            <Typography level="h6">
                                                {powerGroup.PowerConsumed} MW
                                            </Typography>
                                            <Typography level="body2">
                                                Current consumption
                                            </Typography>
                                        </Card>
                                    </Grid>
                                    <Grid xs>
                                        <Card variant="outlined">
                                            {/* <CardHeader title={powerGroup.PowerMaxConsumed+ " MW"} subheader="Power max. Consumed"></CardHeader> */}
                                            <Typography level="h6">
                                                {powerGroup.PowerMaxConsumed} MW
                                            </Typography>
                                            <Typography level="body2">
                                                Max. Consumed
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{marginTop: "30px"}}>
                                    <Grid xs>
                                        <Typography level="h6" >Battery</Typography>
                                    </Grid>
                                    <Grid>
                                        {powerGroup.BatteryCapacity === 0 && powerGroup.BatteryTimeFull === "00:00:00" ? <Chip startDecorator={<BsCloudSlash size={'20px'}/> } sx={{paddingLeft: '6px'}} >No Battery connected</Chip> : <Chip startDecorator={<BsBatteryHalf size={'20px'}/>} sx={{paddingLeft: '6px', color: 'white'}} color="success">Battery connected</Chip>}
                                    </Grid>
                                </Grid>
                                { powerGroup.BatteryCapacity === 0 && powerGroup.BatteryTimeFull === "00:00:00" ? 
                                    <>
                                    </>
                                :
                                    <Grid container spacing={2} sx={{marginTop: "20px"}}>
                                        <Grid xs>
                                            <Card variant="outlined">
                                                {/* <CardHeader title={powerGroup.BatteryCapacity+ " MW"} subheader="Battery Capacity"></CardHeader> */}
                                                <Typography>
                                                    {powerGroup.BatteryCapacity} MW
                                                </Typography>
                                                <Typography level="body2">
                                                    Battery Capacity
                                                </Typography>
                                            </Card>
                                        </Grid>
                                        <Grid xs>
                                            <Card variant="outlined">
                                                {/* <CardHeader title={powerGroup.BatteryPercent+ " %"} subheader="Battery Filled Percent"></CardHeader> */}
                                                <Typography>
                                                    {powerGroup.BatteryPercent} %
                                                </Typography>
                                                <Typography level="body2">
                                                    Battery Filled Percent
                                                </Typography>
                                            </Card>
                                        </Grid>
                                        <Grid xs>
                                            <Card variant="outlined">
                                                {/* <CardHeader title={powerGroup.BatteryDifferential+ " MW"} subheader="Battery Differential"></CardHeader> */}
                                                <Typography>
                                                    {powerGroup.BatteryDifferential} MW
                                                </Typography>
                                                <Typography level="body2">
                                                    Battery Differential
                                                </Typography>
                                            </Card>
                                        </Grid>
                                        <Grid xs>
                                            <Card variant="outlined">
                                                {/* <CardHeader title={powerGroup.BatteryTimeFull} subheader="Battery Full At Time"></CardHeader> */}
                                                <Typography>
                                                    {powerGroup.BatteryTimeFull}
                                                </Typography>
                                                <Typography level="body2">
                                                    Battery Full At Time
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    </Grid>}
                                </CardContent>
                            </Card>
                        )
                    })}
                </>
            : 
                <CircularProgress/>
            }
        </Container>
    )
}
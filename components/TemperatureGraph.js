import React, { useEffect, useState } from "react";
import { temperatureData } from "@/data/constants";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { getDatabase, ref, onValue, limitToLast, query } from "firebase/database";
import { app } from "@/lib/firebase";
import moment from "moment";



function TemperatureGraph() {
    // api call from firebase to get temperature data
    const [temData, setTemData] = useState([]);
    useEffect(() => {
        const fetchTempData = async () => {
            // write your logic to fetch the data from firebase
            const db = getDatabase(app);
            const temperatureRef = ref(db, 'test/append');
            const lastTemperatureRef = query(temperatureRef, limitToLast(20))
            onValue(lastTemperatureRef, ts_measures => {
                // If you want to get into details, read the following comments :-)
                // 'ts_measures' is a snapshot raw Object, obtained on changed value of 'timestamped_measures' node
                // e.g. a new push to that node, but is not exploitable yet.
                // If we apply the val() method to it, we get something to start work with,
                // i.e. an Object with the 'nbOfElts' last nodes in 'timestamped_measures' node.
                // console.log(ts_measures.val());
                // => {-LIQgqG3c4MjNhJzlgsZ: {timestamp: 1532694324305, value: 714}, -LIQgrs_ejvxcF0MqFre: {…}, … }
                // We prepare empty arrays to welcome timestamps and luminosity values:
                let datas = [];

                // Next, we iterate on each element of the 'ts_measures' raw Object
                // in order to fill the arrays.
                // Let's call 'ts_measure' ONE element of the ts_measures raw Object
                // A handler function written here as an anonymous function with fat arrow syntax
                // tells what to do with each element:
                // * apply the val() method to it to gain access to values of 'timestamp' and 'value',
                // * push those latter to the appropriate arrays.
                // Note: The luminosity value is directly pushed to 'values' array but the timestamp,
                // which is an Epoch time in milliseconds, is converted to human date
                // thanks to the moment().format() function coming from the moment.js library.    
                ts_measures.forEach(ts_measure => {
                    //console.log(ts_measure.val().timestamp, ts_measure.val().value);
                    const data = {
                        x: moment(ts_measure.val().Ts).format('YYYY-MM-DD HH:mm:ss'),
                        y: ts_measure.val().value
                    }
                    datas.push(data)


                });

                setTemData(datas);
                console.log(
                    datas
                );
            })
        }
        fetchTempData();
    }, []);
    return (
        <LineChart
            width={600}
            height={300}
            data={temData} // temperatureData replaced with temData if fetched from firebase.
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" className="text-xs" />
            <YAxis className="text-sm" />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
            {/* // <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
    );
}

export default TemperatureGraph;

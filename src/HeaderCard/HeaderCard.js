import React, { Component } from 'react';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import XLSX from 'xlsx';

class HeaderCard extends Component {
    constructor(props) {
        super(props);
        this.setState({
            entries: [],
        })
    }

    handleInputFileChange(files) {
        if (files.length === 0) {
            return
        }
        let reader = new FileReader();
        let self = this;
        reader.onloadend = function(e) {
            self.parseXlsTable(e.target.result);
        };
        reader.readAsArrayBuffer(files[0]);
    }

    parseXlsTable(table) {
        let workbook = XLSX.read(table, {type: 'array'});
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(first_worksheet, {range: 4});
        data = data.slice(0, 4)
        data = data.map(async entry => {
            console.log(entry);
            console.log(this.fetchLocation(entry.City));
            return entry.coordinates = this.fetchLocation(entry.City);
        });
        let self = this;
        Promise.all(data).then(data => self.setState({entries: data}))
        console.log(data);
    }

    fetchLocation(city) {
        fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + city + ".json?access_token=" + process.env.REACT_APP_MAPBOX_KEY)
            .then(data => data.json())
            .then(data => {
                console.log(data.features[0].geometry.coordinates)
                return data.features[0].geometry.coordinates;
            });
    }

    render() { 
        return (
            <div className="HeaderCard">
                <Form>
                    <FormGroup>
                        <Label for="exampleCustomFileBrowser">File Browser with Custom Label</Label>
                        <CustomInput
                            type="file"
                            label="Yo, pick a file!"
                            onChange={ e => this.handleInputFileChange(e.target.files) }
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default HeaderCard;

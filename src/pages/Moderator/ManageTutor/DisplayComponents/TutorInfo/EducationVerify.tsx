import React, { useState } from 'react'
import { Education } from '../../Tutor.type';
import { RcFile } from 'antd/lib/upload';
import { Flex, Image, Switch } from 'antd'
import { Clickable } from './TutorInfo.styled';
import FileViewer from '../../../../../components/FileViewer/FileViewer';
interface EducationVerifyProps {
    education: Education;
    handleFunction: (id:number, checked: boolean) => void;
}

const EducationVerify: React.FC<EducationVerifyProps> = (props) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const item: Education = props.education;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [switchStates, setSwitchStates] = useState(false);

    const handlePreview = async (url: string) => {
        setPreviewImage(url);
        setPreviewOpen(true);
    };

    const handleChange = (id: number, checked: boolean) => {
        props.handleFunction(id, checked);
        setSwitchStates(checked);
    }
    const toggleSwitch = (id: number) => {
        handleChange(id, !switchStates);
    };



    return (
        <Clickable
        onClick={() => toggleSwitch(item.id)}
        style={{display:`flex`, justifyContent:`space-between`}}>
            <div style={{display: `flex`, width:`50%`}}>
            <div style={{margin:`auto`}}>
            <FileViewer alt='diploma' 
                fileUrl={item.diplomaUrl} 
                width='100' 
                borderRadius='20px' />
            </div>
            <div style={{margin:`auto`, marginLeft:`20px`}}>
            <p>{item.universityName}</p>
            <p style={{fontWeight:`bold`}}>
                {`${item.degreeType.slice(0,1)}${item.degreeType.slice(1).toLowerCase()} `}
                of {item.majorName}</p>
            <p>Specialization: {item.specialization}</p>
            <p>{item.startYear} - {item.endYear}</p>
            </div>
            </div>
            <Switch
                checkedChildren="Admit"
                unCheckedChildren="Deny"
                checked={switchStates}
                style={{ margin: `auto` }}
                onChange={(checked) => handleChange(item.id, checked)}
            />
        </Clickable>
    )
}

export default EducationVerify
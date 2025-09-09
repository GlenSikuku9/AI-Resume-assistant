import ResumeStepper from '../../components/resume/ResumeStepper';

function CreateResume() {
  return (
    <div className="create-resume-container">
      <ResumeStepper currentStep={1} />
    </div>
  );
}

export default CreateResume; 
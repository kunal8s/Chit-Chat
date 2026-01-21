const GenderCheckbox = ({onCheckboxChange,selectedGender}) => {
	return (
		<div className='flex'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${selectedGender==="Male" ? "selected" : ""}`}>
					<span className='label-text text-white'>Male</span>
					<input type='checkbox' className='checkbox border-slate-500'
					checked={selectedGender==="Male"}
					onChange={(e)=>onCheckboxChange("Male")}
					/>
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer`}>
					<span className='label-text text-white'>Female</span>
					<input type='checkbox' className='checkbox border-slate-800' 
					checked={selectedGender==="Female"}
					onChange={(e)=>onCheckboxChange("Female")}
					/>
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;
/*package com.ofds.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ofds.exception.NoDataFoundException;
import com.ofds.exception.RecordAlreadyFoundException;
import com.ofds.entity.CustomerEntity;
import com.ofds.repository.CustomerRepository;

@Service
public class CustomerService {

	@Autowired
	CustomerRepository custRepo;
	
	public ResponseEntity<List<CustomerEntity>> getCustomerData() throws NoDataFoundException
	{
		List<CustomerEntity> stuLst = custRepo.findAll();
		
		if(stuLst != null)
			return new ResponseEntity<>(stuLst, HttpStatus.OK);
		else
			throw new NoDataFoundException("No Records found in the database..");
	}
	
	public ResponseEntity<CustomerEntity> insertCustomerData(CustomerEntity customerObj) throws RecordAlreadyFoundException
	{Optional<CustomerEntity> custObjOp = custRepo.findByEmail(customerObj.getEmail());

	if (custObjOp.isPresent()) 
	{
		throw new RecordAlreadyFoundException("Given record exists in the database");
	} 
	else 
	{
		CustomerEntity custObj1 = custRepo.save(customerObj);
		return new ResponseEntity<>(custObj1, HttpStatus.CREATED);
}

}}

*/

package com.ofds.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ofds.dto.CustomerDTO;
import com.ofds.dto.LoginDTO;
import com.ofds.entity.CustomerEntity;
import com.ofds.exception.NoDataFoundException;
import com.ofds.exception.RecordAlreadyFoundException;
import com.ofds.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository custRepo;

    @Autowired
    private ModelMapper modelMapper;
    
    // get all customers
    public ResponseEntity<List<CustomerDTO>> getCustomerData() throws NoDataFoundException {
        List<CustomerEntity> entityList = custRepo.findAll();

        if (entityList.isEmpty()) 
        {
            throw new NoDataFoundException("No Records found in the database.");
        }

        List<CustomerDTO> dtoList = entityList.stream()
            .map(entity -> modelMapper.map(entity, CustomerDTO.class))
            .collect(Collectors.toList());

        return new ResponseEntity<>(dtoList, HttpStatus.OK);
    }
    
    //signing up new user
    public ResponseEntity<CustomerDTO> insertCustomerData(CustomerDTO customerDTO) throws RecordAlreadyFoundException {
        Optional<CustomerEntity> existing = custRepo.findByEmail(customerDTO.getEmail());

        if (existing.isPresent())
        {
            throw new RecordAlreadyFoundException("Given record exists in the database");
        }

        CustomerEntity entity = modelMapper.map(customerDTO, CustomerEntity.class);
        CustomerEntity saved = custRepo.save(entity);
        CustomerDTO responseDTO = modelMapper.map(saved, CustomerDTO.class);

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    


}


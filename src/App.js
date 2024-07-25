import React, { useState } from 'react';
import axios from 'axios';
import { 
  ChakraProvider, 
  Box, 
  Button, 
  Input, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Text, 
  Spinner, 
  useDisclosure,
  useToast,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@chakra-ui/react';

const App = () => {
  const [partNumber, setPartNumber] = useState('');
  const [volume, setVolume] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]); // State for cart items
  const [isCartOpen, setIsCartOpen] = useState(false); // State for sidebar visibility

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = async () => {
    setError('');
    
    const trimmedPartNumber = partNumber.trim();
    const trimmedVolume = volume.trim();
    
    if (!trimmedPartNumber || !trimmedVolume) {
      toast({
        title: "Error",
        description: "Both Part Number and Volume are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/compare', { partNumber: trimmedPartNumber, volume: trimmedVolume });

      const uniqueResults = [];
      const seen = new Set();

      response.data.forEach(item => {
        const itemKey = JSON.stringify(item);
        if (!seen.has(itemKey)) {
          seen.add(itemKey);
          uniqueResults.push(item);
        }
      });

      setResults(uniqueResults);
    } catch (error) {
      setError('Error fetching data from the server.');
      toast({
        title: "Error",
        description: "Error fetching data from the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.manufacturerPartNumber === item.manufacturerPartNumber);
      if (existingItemIndex >= 0) {
        // If item already exists, update the volume
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          volume: item.volume,
          unitPrice: (item.unitPrice / item.volume) * item.volume,
          totalPrice: (item.unitPrice / item.volume) * item.volume * item.volume
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, {
          ...item,
          volume: item.volume,
          unitPrice: (item.unitPrice / item.volume) * item.volume,
          totalPrice: (item.unitPrice / item.volume) * item.volume * item.volume
        }];
      }
    });
    onOpen(); // Open the cart sidebar
  };

  const handleVolumeChange = (index, e) => {
    const newVolume = parseFloat(e.target.value);
    if (!isNaN(newVolume)) {
      setCart(prevCart => {
        const updatedCart = [...prevCart];
        updatedCart[index] = {
          ...updatedCart[index],
          volume: newVolume,
          unitPrice: (updatedCart[index].unitPrice / updatedCart[index].volume) * newVolume,
          totalPrice: (updatedCart[index].unitPrice / updatedCart[index].volume) * newVolume * newVolume
        };
        return updatedCart;
      });
    }
  };

  const handleRemoveFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" p={5}>
        <Box position="absolute" top={5} right={5}>
          <Button onClick={isOpen ? onClose : onOpen} colorScheme="teal">
           Open Cart
          </Button>
        </Box>

        <Text fontSize="4xl" as='b' mb={5}>ZIONIX APP</Text>

        <Box mb={5}  maxW="600px" mx="auto" display="flex" flexDirection="column" alignItems="center">
          <Input 
            placeholder="Part No." 
            value={partNumber} 
            onChange={(e) => setPartNumber(e.target.value)} 
            mb={2} 
          />
          <Input 
            type="number" 
            placeholder="Volume" 
            value={volume} 
            onChange={(e) => setVolume(e.target.value)} 
            mb={2} 
          />
          <Button onClick={handleSubmit} isLoading={loading} colorScheme="teal">
            ENTER
          </Button>
        </Box>

        {error && <Text color="red.500" mb={5}>{error}</Text>}

        {results.length > 0 && (
          <Table variant="striped" colorScheme="teal" mt={5}>
            <Thead>
              <Tr>
                <Th>Manufacturer Part Number</Th>
                <Th>Manufacturer</Th>
                <Th>Data Provider</Th>
                <Th>Volume</Th>
                <Th>Unit Price</Th>
                <Th>Total Price</Th>
                <Th>Add to Cart</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.manufacturerPartNumber}</Td>
                  <Td>{item.manufacturer}</Td>
                  <Td>{item.dataProvider}</Td>
                  <Td>{item.volume}</Td>
                  <Td>{item.unitPrice.toFixed(2)}</Td>
                  <Td>{item.totalPrice.toFixed(2)}</Td>
                  <Td>
                    {index === 0 && (
                      <Button onClick={() => handleAddToCart(item)} colorScheme="teal">
                        ADD TO CART
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {loading && <Spinner size="xl" mt={5} />}

        {isOpen && cart.length > 0 && (
 <Box 
 position="fixed" 
 top={0} 
 right={0} 
 width="300px" 
 height="100%" 
 bg="gray.800" 
 color="white" 
 p={5} 
 boxShadow="lg"
 overflowY="auto" 
 
>
 <Text fontSize="2xl" as='b' mb={4} textAlign="center" color="white">MY CART</Text>
 <Stack spacing={4} mb={4} align="center">
   {cart.map((item, index) => (
     <Card 
       key={index} 
       borderWidth="1px" 
       borderRadius="md" 
       bg="gray.700" 
       p={4}
       width="100%" // Ensure the Card takes full width available
     >
       <CardHeader>
         <Text fontSize="lg" fontWeight="bold" color="white">
           {item.manufacturerPartNumber}
         </Text>
       </CardHeader>
       <CardBody>
         <Text mb={2} color="white"><b>Manufacturer:</b> {item.manufacturer}</Text>
         <Text mb={2} color="white"><b>Data Provider:</b> {item.dataProvider}</Text>
         <Text mb={2} color="white">
           <b>Volume:</b>
           <Box alignItems="center" >
             <Input 
               type="number" 
               value={item.volume} 
               onChange={(e) => handleVolumeChange(index, e)} 
               size="sm" 
               mx="auto" 
               color="white" // Change input text color if needed
               variant="outline" // Add variant to ensure it has proper styling
             />
           </Box>
         </Text>
         <Text mb={2} color="white"><b>Unit Price:</b> {item.unitPrice.toFixed(2)}</Text>
         <Text mb={4} color="white"><b>Total Price:</b> {item.totalPrice.toFixed(2)}</Text>
       </CardBody>
       <CardFooter>
     
           <Button 
             onClick={() => handleRemoveFromCart(index)} 
             colorScheme="red" 
             size="sm"
             textAlign="center" 
             width="100%" 
           >
             Remove
           </Button>
         
       </CardFooter>
     </Card>
   ))}
 </Stack>
 <Button 
   onClick={onClose} 
   colorScheme="teal" 
   width="100%"
 >
   Close
 </Button>
</Box>

)}


      </Box>
    </ChakraProvider>
  );
};

export default App;

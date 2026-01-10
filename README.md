# Diploma Certification Web3

A blockchain-based diploma certification system built with Spring Boot, React, and Hardhat. This project enables secure and verifiable diploma certificates on the blockchain.

## 📋 Project Structure

```
diploma-certification-web3/
├── diploma-backend/      # Spring Boot backend API
├── diploma-frontend/     # React frontend application
└── diploma-hardhat/      # Hardhat blockchain development environment
```

## 🚀 Technology Stack

### Backend
- **Spring Boot 4.0.1** (Java 21)
- **PostgreSQL** - Database
- **Spring Security** - Authentication & Authorization
- **Web3j** - Blockchain integration
- **iText PDF** - PDF generation
- **Spring Mail** - Email notifications
- **Lombok** - Code generation

### Frontend
- **React 19.2** with TypeScript
- **Vite 7.2** - Build tool
- **Tailwind CSS 4.1** - Styling
- **React Router DOM 7** - Routing
- **Axios** - HTTP client
- **Ethers.js** - Blockchain interaction
- **Lucide React** - Icons

### Blockchain
- **Hardhat 2.22** - Ethereum development environment
- **Solidity 0.8.28** - Smart contract language
- **OpenZeppelin Contracts** - Smart contract libraries

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Java JDK 21**
- **Maven** (latest version)
- **PostgreSQL** (v14 or higher)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Yes-sir404/Web3-Dapp-Marketplace.git
cd Web3-Dapp-Marketplace
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE diploma_db;
CREATE USER diploma_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE diploma_db TO diploma_user;
```

### 3. Backend Setup (diploma-backend)

```bash
cd diploma-backend

# Create .env file with your configuration
# Copy the example below and update values:
```

Create a `.env` file in `diploma-backend/` directory:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/diploma_db
SPRING_DATASOURCE_USERNAME=diploma_user
SPRING_DATASOURCE_PASSWORD=your_password

# Blockchain Configuration
WEB3_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=your_deployed_contract_address
```

Install dependencies and run:

```bash
# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 4. Blockchain Setup (diploma-hardhat)

```bash
cd diploma-hardhat

# Install dependencies
npm install

# Create .env file for blockchain configuration
```

Create a `.env` file in `diploma-hardhat/` directory:

```env
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_key (if deploying to testnet)
```

Start local Hardhat node:

```bash
# Start local blockchain node
npx hardhat node
```

In a new terminal, compile and deploy contracts:

```bash
cd diploma-hardhat

# Compile smart contracts
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

**Note:** Copy the deployed contract address and update it in the backend `.env` file.

### 5. Frontend Setup (diploma-frontend)

```bash
cd diploma-frontend

# Install dependencies
npm install

# Create .env file (if needed for API URL)
```

Optionally, create a `.env` file in `diploma-frontend/` directory if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:8080/api
```

Run the development server:

```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

## 🎯 Running the Complete Application

To run the complete application, you need to start all three components:

1. **Terminal 1** - Start PostgreSQL (if not running as service)
2. **Terminal 2** - Start Hardhat local blockchain:
   ```bash
   cd diploma-hardhat
   npx hardhat node
   ```

3. **Terminal 3** - Start Backend:
   ```bash
   cd diploma-backend
   mvn spring-boot:run
   ```

4. **Terminal 4** - Start Frontend:
   ```bash
   cd diploma-frontend
   npm run dev
   ```

## 🔨 Build for Production

### Backend
```bash
cd diploma-backend
mvn clean package
java -jar target/diploma-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd diploma-frontend
npm run build
# The build output will be in the 'dist' folder
```

## 🧪 Testing

### Backend Tests
```bash
cd diploma-backend
mvn test
```

### Smart Contract Tests
```bash
cd diploma-hardhat
npx hardhat test
```

## 📱 Default Access

After setup, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Hardhat Node**: http://127.0.0.1:8545

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Bahraoui Yassir**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bahraoui-yassir/)

## ⚠️ Important Notes

- Make sure PostgreSQL is running before starting the backend
- The Hardhat node must be running for blockchain interactions
- Update the contract address in backend configuration after deployment

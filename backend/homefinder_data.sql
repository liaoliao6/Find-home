-- MySQL dump 10.13  Distrib 8.0.20, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: homefinder
-- ------------------------------------------------------
-- Server version	5.7.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (3,4,'PENDING',3,0,_binary '€•M\0\0\0\0\0\0\0}”(Œdown_payment”Mx7Œ\noccupation”Œsoftware engineer”Œ\rannual_salary”JðI\0u.',4,'2020-11-02 23:38:59','2020-11-02 23:38:59');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `property`
--

LOCK TABLES `property` WRITE;
/*!40000 ALTER TABLE `property` DISABLE KEYS */;
INSERT INTO `property` VALUES (3,'active',4,'Townhouse','94538','4631 Norwood Ter','Fremont','CA','US',_binary '€•#\0\0\0\0\0\0\0}”(Œbeds”KŒbath”KŒstories”Ku.',NULL,0,NULL,_binary '€•&\0\0\0\0\0\0\0}”(Œprice”J\Èm\0Œdown_payment”J(I\0u.',NULL,'2020-11-02 23:30:21','2020-11-02 23:30:21'),(49,'active',4,'Townhouse','94538','4631 Norwood Ter','Fremont','CA','US',_binary '€•#\0\0\0\0\0\0\0}”(Œbeds”KŒbath”KŒstories”Ku.',NULL,0,NULL,_binary '€•&\0\0\0\0\0\0\0}”(Œprice”J\Èm\0Œdown_payment”J(I\0u.',_binary '€•!\0\0\0\0\0\0\0]”(Œ50612060128”Œ50612915727”e.','2020-11-17 08:46:46','2020-11-17 08:46:46'),(50,'active',4,'Townhouse','94538','4631 Norwood Ter','Fremont','CA','US',_binary '€•#\0\0\0\0\0\0\0}”(Œbeds”KŒbath”KŒstories”Ku.',NULL,0,NULL,_binary '€•&\0\0\0\0\0\0\0}”(Œprice”J\Èm\0Œdown_payment”J(I\0u.',_binary '€•!\0\0\0\0\0\0\0]”(Œ50612825541”Œ50612825691”e.','2020-11-17 08:56:11','2020-11-17 08:56:11'),(51,'active',4,'Townhouse','94538','4631 Norwood Ter','Fremont','CA','US',_binary '€•#\0\0\0\0\0\0\0}”(Œbeds”KŒbath”KŒstories”Ku.',NULL,0,NULL,_binary '€•&\0\0\0\0\0\0\0}”(Œprice”J\Èm\0Œdown_payment”J(I\0u.',_binary '€•!\0\0\0\0\0\0\0]”(Œ50619626697”Œ50619626847”e.','2020-11-19 04:14:47','2020-11-19 04:14:47');
/*!40000 ALTER TABLE `property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'Baijun','Jiang','lucas.jiang948@gmail.com','$2b$12$s6p7741.aAQ8P5IM/ooNgeE7HEnYfsX6zzRwrk2Li29TS63i010Zy','APPROVED','renter',NULL,NULL,'2020-10-28 18:52:42','2020-11-04 20:04:38'),(12,'','','lucas.jiang949@gmail.com','$2b$12$RQsWgYIyw7rXWSqiDdd8tevAgN7pX1rMfPxc.zSAmwlqtlkzNUjy6','APPROVED','renter',NULL,NULL,'2020-11-04 00:16:12','2020-11-04 00:25:40');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-24  0:55:16

-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: student_research_management
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `supervisor_id` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `research_topics` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `research_topics` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `final_submissions`
--

DROP TABLE IF EXISTS `final_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `final_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `student_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `final_submissions_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `research_topics` (`id`) ON DELETE CASCADE,
  CONSTRAINT `final_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `final_submissions`
--

LOCK TABLES `final_submissions` WRITE;
/*!40000 ALTER TABLE `final_submissions` DISABLE KEYS */;
INSERT INTO `final_submissions` VALUES (1,9,8,'1784107641584-AUDIT REPORT FOR JANUARY TO AUGUST 2022.docx','2026-07-15 09:27:21'),(2,18,16,'1784268050001-AUDIT REPORT FOR JANUARY TO AUGUST 2022.docx','2026-07-17 06:00:50');
/*!40000 ALTER TABLE `final_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_feedback`
--

DROP TABLE IF EXISTS `research_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `supervisor_id` int NOT NULL,
  `feedback` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `research_feedback_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `research_topics` (`id`) ON DELETE CASCADE,
  CONSTRAINT `research_feedback_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_feedback`
--

LOCK TABLES `research_feedback` WRITE;
/*!40000 ALTER TABLE `research_feedback` DISABLE KEYS */;
INSERT INTO `research_feedback` VALUES (1,1,6,'The research topic is approved. Improve the literature review section and include more recent references.','2026-07-08 09:34:02');
/*!40000 ALTER TABLE `research_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_progress`
--

DROP TABLE IF EXISTS `research_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `student_id` int NOT NULL,
  `progress` text NOT NULL,
  `status` enum('Pending','Reviewed','Completed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `research_progress_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `research_topics` (`id`) ON DELETE CASCADE,
  CONSTRAINT `research_progress_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_progress`
--

LOCK TABLES `research_progress` WRITE;
/*!40000 ALTER TABLE `research_progress` DISABLE KEYS */;
INSERT INTO `research_progress` VALUES (1,1,4,'Completed system requirements analysis and started database implementation.','Reviewed','2026-07-08 09:48:42');
/*!40000 ALTER TABLE `research_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_topics`
--

DROP TABLE IF EXISTS `research_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_topics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `supervisor_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lecturer_comment` text,
  `supervisor_feedback` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_topic_title` (`title`),
  KEY `student_id` (`student_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `research_topics_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `research_topics_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_topics`
--

LOCK TABLES `research_topics` WRITE;
/*!40000 ALTER TABLE `research_topics` DISABLE KEYS */;
INSERT INTO `research_topics` VALUES (1,4,'Online Student Research Management System','A web-based system for managing student research topics, approvals, supervisors, and progress.','Approved',13,'2026-07-08 08:17:50',NULL,NULL),(2,4,'Library Management System','Research about library automation.','Pending',NULL,'2026-07-08 12:09:43',NULL,NULL),(3,4,'Hospital Management System','Research about digital health records.','Pending',NULL,'2026-07-08 12:10:06',NULL,NULL),(4,7,'Library System','Library automation.','Rejected',NULL,'2026-07-08 12:35:09',NULL,NULL),(5,7,'Hospital System','Hospital management.','Approved',6,'2026-07-08 12:35:50',NULL,NULL),(6,7,'Voting System','Online voting.','Rejected',NULL,'2026-07-08 12:36:12',NULL,NULL),(8,8,'milk collecting system','a system used to collect milk easily','Rejected',NULL,'2026-07-09 07:35:06',NULL,NULL),(9,8,'sugar management system','helps companies in the supply and management of their sugar','Approved',13,'2026-07-09 09:30:27','Reviewed by Lecturer','continue with literature review'),(10,10,'gas management system','helps in gas delivery','Approved',13,'2026-07-09 13:05:49','go ahead with the project','continue with chapter 1'),(11,10,'bus management system','helps in booking','Pending',NULL,'2026-07-09 13:13:50',NULL,NULL),(12,11,'bus booking system','helps passangers book their tickets','Approved',6,'2026-07-09 13:17:24','continue with chapter 1',NULL),(14,11,'furniture management system','helps workers do sales','Pending',NULL,'2026-07-09 13:33:46',NULL,NULL),(15,12,'table banking system','helps in tabling money','Approved',13,'2026-07-09 13:38:21','good','good'),(16,15,'task based monitoring system','helps in placing tasks','Rejected',NULL,'2026-07-17 05:45:07',NULL,NULL),(17,15,'government project tracker','used to track start and completion of government projects','Approved',6,'2026-07-17 05:46:33','good topic',NULL),(18,16,'construction transportation system','provides transportation for construction system','Approved',17,'2026-07-17 05:55:40','continue with the design phase','continue with chapter 1'),(19,15,'Online Student Research Management System again.','manages student research management','Pending',NULL,'2026-07-17 07:25:41',NULL,NULL);
/*!40000 ALTER TABLE `research_topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','lecturer','supervisor','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Brian kipkoech','brian2@gmail.com','$2b$10$BAeXDtqOvtDWu4HSvzVrUeBQkTYbD2LqDAyCp5zDFxPn.n8sp82U6','student','2026-07-07 13:50:50'),(5,'John Lecturer','lecturer@gmail.com','$2b$10$lJm2XsKyVhW8FXbzTqzns.V5p5mbyqjaSeLawOL3WKyx3VMcImc0a','lecturer','2026-07-08 08:37:00'),(6,'Mary Supervisor','supervisor@gmail.com','$2b$10$ePDo/fTpU3uy/u3IX7s6jOpAf1hYM14GxIt5OdZUDg5U0tyoGPDhe','supervisor','2026-07-08 09:05:02'),(7,'James Student','james@gmail.com','$2b$10$gkasYVz8HbnNmrPSDzEl6OIja2ODITjxc6snX6ykIaqtePvQ.0Bc6','student','2026-07-08 12:32:08'),(8,'Brian Kipkoech','kipkoech@gmail.com','$2b$10$1HgIU89LXLBXpn/F2K5QKuu4NQ/qWazjHJfB5Z2b8mnFSrR/pjbfu','student','2026-07-09 06:05:44'),(9,'Boniface Kipkorir','boniface@gmail.com','$2b$10$xbxe19Jaf4AId1qpqY82o.Hz/OiTOk5bsKFZT37yqBpTTDc/EDqfq','lecturer','2026-07-09 09:31:36'),(10,'brian ngetich','brian@gmail.com','$2b$10$82dbojvV0mQDXGI0MiTTmOA7Cq5Fq.y74qNRIyKGl98Xoob9JwZay','student','2026-07-09 13:05:09'),(11,'enock kipkorir','enock@gmail.com','$2b$10$T5NGLZUrpgBGH.G6ICyKROxn3eRpF7YT.tLpBIL5pFoF5uZM.QGbW','student','2026-07-09 13:16:16'),(12,'tonny kiprono','tonny@gmail.com','$2b$10$AcT45Bki1.Hfp/ctOtVIduRo1K1aNy8KalOwxYkRatq52boqsB9oa','student','2026-07-09 13:36:28'),(13,'mary','mary@gmail.com','$2b$10$e5SOm97dGwX4AuYokE41memYG3x2fRFkq1UVJJCToa/AxT.ZYpe.O','supervisor','2026-07-10 06:38:28'),(14,'alfred ngetich','alfred@gmail.com','$2b$10$Jx/dXWGpkQ4QcAxAmXJaIuMllKIC3iNuGBB4kDEU96ygUq41GLKRW','admin','2026-07-15 13:12:09'),(15,'brian kipkoech','kipkoech2@gmail.com','$2b$10$MwyVPAzQHGG6rzi3QtTdxefVN9FFO9FQPm.3nfMkZEBwn3gpvRazC','student','2026-07-17 05:37:35'),(16,'wanjiru','wanjiru@gmail.com','$2b$10$CANxQLoQrjK1KIkvoaZ8fuODGnkQkE0idRzM/tKLoUns/dflXfAoe','student','2026-07-17 05:53:54'),(17,'saku musa','saku@gmail.com','$2b$10$/EHzVuxhd6C1aqw6eSpJ8u35U82sX47oS7.5PyNR4RvhFSL1eXiEm','supervisor','2026-07-17 05:57:03'),(18,'kipkorir','kipkorir@gmail.com','$2b$10$oLQbgKpom3CjrIPweULLa.HQp2JXt4uy.IrefLCP3rOcSP/CkJFqG','student','2026-07-17 07:43:15');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-23 10:10:21

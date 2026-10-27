-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2019 年 05 月 14 日 17:21
-- 伺服器版本： 10.1.38-MariaDB
-- PHP 版本： 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `kehua`
--

-- --------------------------------------------------------

--
-- 資料表結構 `kalbum`
--

CREATE TABLE `kalbum` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `knews`
--

CREATE TABLE `knews` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `kphoto`
--

CREATE TABLE `kphoto` (
  `id` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  `filelink` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `thumb` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `kvideo`
--

CREATE TABLE `kvideo` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `iframe` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `link` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `kvideo`
--

INSERT INTO `kvideo` (`id`, `date`, `title`, `iframe`, `link`) VALUES
(11, '2019-04-16', 'æ¨‚è¨ˆç•«-ç’°å³¶è¶´è¶´GO/é•·ç‰ˆ', '<iframe width=\"320\" height=\"260\" src=\"https://www.youtube.com/embed/KYVnF3-1Wx0\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>', 'https://www.youtube.com/watch?v=KYVnF3-1Wx0&feature=youtu.be'),
(2, '2019-04-14', 'è¶´è¶´GO1', '<iframe width=\"320\" height=\"260\" src=\"https://www.youtube.com/embed/lg04fjsAYTo\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>', 'https://www.youtube.com/watch?v=lg04fjsAYTo'),
(3, '2019-04-14', 'è¶´è¶´GO2', '<iframe width=\"320\" height=\"260\" src=\"https://www.youtube.com/embed/KYVnF3-1Wx0\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>', 'https://www.youtube.com/watch?v=lg04fjsAYTo'),
(7, '2019-04-16', 'æ¨‚è¨ˆç•«-NSOèˆ‡è˜‡æ‰“ç¶ ', '<iframe width=\"320\" height=\"260\" src=\"https://www.youtube.com/embed/i9pRVvBh64U\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>', 'https://www.youtube.com/watch?v=i9pRVvBh64U'),
(8, '2019-04-16', 'è¶´è¶´GO', '<iframe width=\"320\" height=\"260\" src=\"https://www.youtube.com/embed/lg04fjsAYTo\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>', 'https://www.youtube.com/watch?v=lg04fjsAYTo'),
(9, '2019-04-16', 'æ¨‚è¨ˆç•«-ç’°å³¶è¶´è¶´GO', '<iframe width=\"320\" height=\"260\" src=\"https://www.youtube.com/embed/KYVnF3-1Wx0\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>', 'https://www.youtube.com/watch?v=KYVnF3-1Wx0&feature=youtu.be');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `kalbum`
--
ALTER TABLE `kalbum`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `knews`
--
ALTER TABLE `knews`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `kphoto`
--
ALTER TABLE `kphoto`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `kvideo`
--
ALTER TABLE `kvideo`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動增長(AUTO_INCREMENT)
--

--
-- 使用資料表自動增長(AUTO_INCREMENT) `kalbum`
--
ALTER TABLE `kalbum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `knews`
--
ALTER TABLE `knews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `kphoto`
--
ALTER TABLE `kphoto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `kvideo`
--
ALTER TABLE `kvideo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

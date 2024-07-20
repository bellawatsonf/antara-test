// import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Avatar, Button, Empty, Input, Pagination, Spin } from "antd";

import {
  DownOutlined,
  RightOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";

function App() {
  const [org, setOrg] = useState("");
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRepos, setTotalRepos] = useState(0);
  const [loading, setLoading] = useState(false);
  const reposPerPage = 10;
  const [sortingData, setSorting] = useState("ASC");

  const toggleContent = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const fetchRepos = async (page = 1, param) => {
    console.log(param, "ini param");
    try {
      const response = await fetch(
        `https://api.github.com/orgs/${org}/repos?per_page=${reposPerPage}&page=${page}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(
        data.sort((a, b) => a.name - b.name),
        param,
        "ini datanya"
      );
      if (param === "ASC") {
        const sortedRepos = data.sort((a, b) => a.name.localeCompare(b.name));

        setRepos(sortedRepos);
        setCurrentPage(page);
      } else {
        const sortedRepos = data.sort((a, b) => b.name.localeCompare(a.name));
        setRepos(sortedRepos);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching repositories", error);
    }
  };

  const fetchCommits = async (repoName) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${org}/${repoName}/commits`
      );
      // const response = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCommits(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commits", error);
    }
  };

  const handlePaging = (page) => {
    fetchRepos(page);
  };

  // const sorting = (data) => {
  //   console.log(data, "ini data");
  //   if (sortingData !== "ASC") {
  //     const sortedRepos = data.sort(
  //       (a, b) => b.stargazers_count - a.stargazers_count
  //     );
  //     setRepos(sortedRepos);
  //   } else {
  //     const sortedRepos = data.sort(
  //       (a, b) => a.stargazers_count - b.stargazers_count
  //     );
  //     setRepos(sortedRepos);
  //   }
  // };

  return (
    <div className="container mx-auto ">
      <div className="bg-gray-100 p-4 h-[100vh] md:h-full">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold mb-2 mt-4 text-center">
            Github Organization
          </h2>
          <div className="p-4 border-b border-gray-200 flex flex-row items-center">
            <Input
              placeholder="Enter Organization Name"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={() => {
                fetchRepos();
                setCurrentPage(1);
              }}
              className="ml-2 text-gray-500 focus:outline-none"
            >
              <SearchOutlined />
            </Button>
          </div>
          <div className="p-4">
            <div className="flex flex-row">
              <div className="flex justify-start w-[50%]">
                <h2 className="text-xl font-semibold mb-4">Repository</h2>
              </div>
              <div className="flex justify-end w-[50%]">
                {repos.length > 0 ? (
                  sortingData !== "ASC" ? (
                    <SortAscendingOutlined
                      onClick={() => {
                        setSorting("ASC");
                        fetchRepos(1, sortingData);
                      }}
                    />
                  ) : (
                    <SortDescendingOutlined
                      onClick={() => {
                        setSorting("DESC");

                        fetchRepos(1, sortingData);
                      }}
                    />
                  )
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              {repos.length > 0 ? (
                repos.map((repo) => (
                  <div>
                    <div
                      className="flex bg-[#0038FF] text-white items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer"
                      onClick={() => {
                        toggleContent(repo.id);
                        fetchCommits(repo.name);
                      }}
                    >
                      <span> {repo.name}</span>
                      {activeIndex === repo.id ? (
                        <DownOutlined />
                      ) : (
                        <RightOutlined />
                      )}
                    </div>

                    <div
                      className={`transition-all duration-300 ms-4 ${
                        activeIndex === repo.id
                          ? "max-h-96 opacity-100 overflow-y-auto"
                          : "max-h-0 opacity-0 overflow-hidden scroll"
                      }`}
                    >
                      <div className="p-4 border border-t-0 border-gray-300 rounded-b-lg">
                        {!loading ? (
                          commits.map((commit) => (
                            <>
                              <div
                                key={commit.sha}
                                className="flex flex-row text-xs p-4 border bg-[#F7F7F7] mb-2  border-gray-300 rounded-b-lg"
                              >
                                <div className="flex">
                                  {commit.author && (
                                    <Avatar
                                      src={commit.author.avatar_url}
                                      alt={commit.author.login}
                                      className="flex mr-2 w-[40px] h-[40px]"
                                      // size={40}
                                    >
                                      {commit.author.login[0]}
                                    </Avatar>
                                  )}
                                </div>
                                <div className="flex flex-col    overflow-hidden  ">
                                  <a
                                    href={commit.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                  >
                                    {commit.commit.message}
                                  </a>{" "}
                                  <span className="w-full flex justify-end mt-2">
                                    by {commit.commit.author.name}
                                  </span>
                                </div>
                              </div>
                            </>
                          ))
                        ) : (
                          <Spin className="flex justify-center" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
            <div className="w-full text-center flex justify-center">
              {repos.length > 0 && (
                <Pagination
                  current={currentPage}
                  total={repos.length * reposPerPage}
                  pageSize={reposPerPage}
                  onChange={handlePaging}
                  className="mt-4 text-center"
                  showSizeChanger={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
